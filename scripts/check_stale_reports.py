"""Open reassessment issues for stale Yearn reports and listed dependencies.

Yearn assets (yearn-*.md) are discovered automatically. reports/reassessment.json
lists external protocols/assets used by Yearn, including approved but unfunded
integrations. Other reports are not scanned. Missing reports are logged and
counted as failures after the remaining reports have been scanned.

A report is considered stale if its assessment date is more than STALE_DAYS old.
The assessment date is parsed from the `**Assessment Date:**` line in the report
header; if that line includes one or more "(updated <date>)" annotations, the
latest date wins. If no date can be parsed, falls back to the file's last git
commit date.

Existing open issues with the `reassessment` label and matching title are not
re-created. Out-of-scope issues are flagged for manual review. DRY_RUN previews
eligible stale reports locally without querying GitHub or checking open issues.
"""

import json
import logging
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPORTS_DIR = Path("reports/report")
REASSESSMENT_LIST = Path("reports/reassessment.json")
STALE_DAYS = 60
LABEL = "reassessment"
TITLE_PREFIX = "Reassessment: "
DEFAULT_REPO = "yearn/risk-score"
PUBLIC_REPORT_BASE_URL = "https://curation.yearn.fi/report"

ASSESSMENT_LINE_RE = re.compile(r"\*\*Assessment Date:\*\*\s*([^\n]+)", re.IGNORECASE)
STATUS_LINE_RE = re.compile(r"\*\*Status:\*\*\s*([^\n]+)", re.IGNORECASE)
DATE_RE = re.compile(
    r"\b("
    r"January|February|March|April|May|June|July|August|September|October|November|December"
    r")\s+(\d{1,2}),\s+(\d{4})\b"
)
TITLE_RE = re.compile(r"^#\s+(.+)$", re.MULTILINE)
SCORE_RE = re.compile(r"\*\*Final Score:\s*([\d.]+)\s*/\s*5\.0\*\*")
TERMINAL_STATUSES = {
    "HACKED",
    "DEAD",
    "DEPRECATED",
    "WIND-DOWN",
    "WINDDOWN",
}

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger("stale-reports")


def load_reassessment_reports() -> list[Path]:
    """Validate external dependency slugs and discover Yearn asset reports.

    Returns:
        Sorted paths to reports eligible for reassessment.

    Raises:
        ValueError: If the list is unreadable, malformed, unsorted, or contains Yearn slugs.
    """
    try:
        slugs = json.loads(REASSESSMENT_LIST.read_text())
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ValueError(
            f"cannot read {REASSESSMENT_LIST}: {exc}; fix the report list"
        ) from exc

    if not isinstance(slugs, list):
        raise ValueError(
            f"{REASSESSMENT_LIST} must contain a JSON array of report slugs"
        )
    invalid = [
        slug
        for slug in slugs
        if not isinstance(slug, str)
        or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug)
    ]
    if invalid:
        raise ValueError(
            f"{REASSESSMENT_LIST} contains invalid report slugs: {invalid!r}"
        )
    if len(slugs) != len(set(slugs)):
        raise ValueError(
            f"{REASSESSMENT_LIST} contains duplicate report slugs; remove duplicates"
        )
    if slugs != sorted(slugs):
        raise ValueError(
            f"{REASSESSMENT_LIST} must be sorted alphabetically by report slug"
        )
    if any(slug.startswith("yearn-") for slug in slugs):
        raise ValueError(
            f"{REASSESSMENT_LIST} must contain only external dependencies; "
            "yearn-* reports are discovered automatically"
        )

    paths = [REPORTS_DIR / f"{slug}.md" for slug in slugs]
    paths.extend(REPORTS_DIR.glob("yearn-*.md"))
    return sorted(paths)


def parse_dates_from_line(line: str) -> list[datetime]:
    """Return all `Month Day, Year` dates found in the line, in document order."""
    out = []
    for month, day, year in DATE_RE.findall(line):
        try:
            out.append(
                datetime.strptime(f"{month} {day} {year}", "%B %d %Y").replace(
                    tzinfo=timezone.utc
                )
            )
        except ValueError:
            continue
    return out


def parse_assessment_date(content: str) -> datetime | None:
    m = ASSESSMENT_LINE_RE.search(content)
    if not m:
        return None
    dates = parse_dates_from_line(m.group(1))
    return max(dates) if dates else None


def header_block(content: str) -> str:
    """Return the title/metadata block before the first report section."""
    return content.split("\n## ", 1)[0]


def normalize_status(raw: str | None) -> str | None:
    """Return the normalized status tag, matching the website parser."""
    if not raw:
        return None
    status = re.split(r"[\s(]", raw.strip().upper(), maxsplit=1)[0]
    status = re.sub(r"[^A-Z-]", "", status)
    return status or None


def terminal_status(header: str) -> str | None:
    match = STATUS_LINE_RE.search(header)
    status = normalize_status(match.group(1) if match else None)
    if status in TERMINAL_STATUSES:
        return status
    return None


def git_last_modified(path: Path) -> datetime | None:
    try:
        out = subprocess.check_output(
            ["git", "log", "-1", "--format=%cI", "--", str(path)],
            text=True,
        ).strip()
    except subprocess.CalledProcessError:
        return None
    if not out:
        return None
    return datetime.fromisoformat(out).astimezone(timezone.utc)


def parse_report(path: Path) -> dict:
    content = path.read_text()
    header = header_block(content)
    title_match = TITLE_RE.search(content)
    title = title_match.group(1).strip() if title_match else path.stem
    score_match = SCORE_RE.search(header)
    score = score_match.group(1) if score_match else None
    date = parse_assessment_date(content)
    source = "report-header"
    if date is None:
        date = git_last_modified(path)
        source = "git-last-commit"

    return {
        "path": path,
        "slug": path.stem,
        "title": title,
        "score": score,
        "date": date,
        "date_source": source,
        "terminal_status": terminal_status(header),
    }


def open_reassessment_titles() -> set[str]:
    out = subprocess.check_output(
        [
            "gh",
            "issue",
            "list",
            "--label",
            LABEL,
            "--state",
            "open",
            "--json",
            "title",
            "--limit",
            "500",
        ],
        text=True,
    )
    return {issue["title"] for issue in json.loads(out)}


def flag_out_of_scope_issues(paths: list[Path], existing_titles: set[str]) -> None:
    """Log open reassessment issues whose slugs are no longer eligible.

    Args:
        paths: All selected paths, including missing files that need repair.
        existing_titles: Titles of open issues carrying the reassessment label.
    """
    eligible_titles = {f"{TITLE_PREFIX}{path.stem}" for path in paths}
    for title in sorted(existing_titles - eligible_titles):
        if title.startswith(TITLE_PREFIX):
            log.warning(
                "OUT-OF-SCOPE %s — open issue is no longer scheduled; review and close manually",
                title,
            )


def extract_repo_slug(remote_url: str) -> str | None:
    """Return owner/repo from common GitHub remote URL forms."""
    patterns = (
        r"github\.com[:/]([^/\s]+)/([^/\s]+?)(?:\.git)?$",
        r"^git@github\.com:([^/\s]+)/([^/\s]+?)(?:\.git)?$",
    )
    for pattern in patterns:
        match = re.search(pattern, remote_url.strip())
        if match:
            return f"{match.group(1)}/{match.group(2)}"
    return None


def git_remote_repo_slug() -> str | None:
    try:
        remote_url = subprocess.check_output(
            ["git", "remote", "get-url", "origin"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except subprocess.CalledProcessError:
        return None
    return extract_repo_slug(remote_url)


def repo_slug() -> str:
    return os.environ.get("GITHUB_REPOSITORY") or git_remote_repo_slug() or DEFAULT_REPO


def public_report_url(slug: str) -> str:
    return f"{PUBLIC_REPORT_BASE_URL}/{slug}/"


def source_report_url(slug: str) -> str:
    return f"https://github.com/{repo_slug()}/blob/master/reports/report/{slug}.md"


def build_issue_body(report: dict, days: int) -> str:
    rel = f"reports/report/{report['slug']}.md"
    date_str = report["date"].date().isoformat() if report["date"] else "unknown"
    score_str = f"{report['score']}/5.0" if report["score"] else "unknown"
    return (
        f"The risk assessment **{report['title']}** has not been updated in "
        f"{days} days and is due for reassessment.\n\n"
        f"- **Report:** [{report['slug']}]({public_report_url(report['slug'])})\n"
        f"- **Source:** [`{rel}`]({source_report_url(report['slug'])})\n"
        f"- **Last Assessment Date:** {date_str} (source: {report['date_source']})\n"
        f"- **Current Score:** {score_str}\n"
        f"- **Days Since Last Assessment:** {days}\n"
        f"- **Threshold:** {STALE_DAYS} days\n\n"
        "Opened automatically by the `reassessment-scan` workflow. "
        "Close this issue once the report has been refreshed.\n"
    )


def create_issue(title: str, body: str, dry_run: bool) -> bool:
    cmd = [
        "gh",
        "issue",
        "create",
        "--title",
        title,
        "--body",
        body,
        "--label",
        LABEL,
    ]
    if dry_run:
        log.info("DRY-RUN would run: %s", " ".join(cmd[:3] + [repr(title)]))
        return True
    for attempt in range(3):
        try:
            subprocess.run(cmd, check=True)
            return True
        except subprocess.CalledProcessError as exc:
            if attempt == 2:
                log.error("failed to create issue %r after 3 attempts: %s", title, exc)
                return False
            backoff = 2**attempt
            log.warning(
                "issue create failed (attempt %d/3) — retrying in %ds: %s",
                attempt + 1,
                backoff,
                exc,
            )
            time.sleep(backoff)
    return False


def scan_reports(paths: list[Path], existing_titles: set[str], dry_run: bool) -> int:
    """Apply the existing stale-report rules to the selected report paths.

    Args:
        paths: Reports included in the reassessment list.
        existing_titles: Titles of open reassessment issues to avoid duplicating.
        dry_run: Whether to preview issue creation without writing to GitHub.

    Returns:
        One if any report read or issue creation failed, otherwise zero.
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=STALE_DAYS)
    stale_count = 0
    skipped_count = 0
    failed_count = 0
    for path in paths:
        try:
            report = parse_report(path)
        except (OSError, UnicodeError) as exc:
            log.error(
                "cannot read %s: %s; continuing with remaining reports", path, exc
            )
            failed_count += 1
            continue
        if report["terminal_status"]:
            log.info(
                "SKIP %s — terminal status: %s",
                report["slug"],
                report["terminal_status"],
            )
            skipped_count += 1
            continue
        if report["date"] is None:
            log.warning("could not determine date for %s; skipping", path.name)
            continue

        if report["date"] >= cutoff:
            continue

        days = (now - report["date"]).days
        title = f"{TITLE_PREFIX}{report['slug']}"

        if title in existing_titles:
            log.info("SKIP %s (%d days) — open issue exists", report["slug"], days)
            skipped_count += 1
            continue

        log.info(
            "STALE %s (%d days, source=%s)",
            report["slug"],
            days,
            report["date_source"],
        )
        body = build_issue_body(report, days)
        if create_issue(title, body, dry_run=dry_run):
            stale_count += 1
        else:
            failed_count += 1

    log.info(
        "done: %d new issue(s), %d skipped (already open or terminal), %d failed",
        stale_count,
        skipped_count,
        failed_count,
    )
    return 1 if failed_count else 0


def main() -> int:
    dry_run = os.environ.get("DRY_RUN", "").lower() in ("1", "true", "yes")
    if not REPORTS_DIR.is_dir():
        log.error("reports directory not found: %s", REPORTS_DIR)
        return 1

    try:
        paths = load_reassessment_reports()
    except ValueError as exc:
        log.error("%s", exc)
        return 1

    if dry_run:
        log.info(
            "DRY-RUN offline preview — no GitHub calls; open issues are not checked"
        )
    log.info(
        "scanning %d Yearn reports and dependencies from %s",
        len(paths),
        REASSESSMENT_LIST,
    )
    existing_titles = set() if dry_run else open_reassessment_titles()
    flag_out_of_scope_issues(paths, existing_titles)
    if not dry_run:
        log.info("found %d existing open reassessment issues", len(existing_titles))
    return scan_reports(paths, existing_titles, dry_run)


if __name__ == "__main__":
    sys.exit(main())
