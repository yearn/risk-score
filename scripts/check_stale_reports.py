"""Scan reports/report/*.md and open reassessment issues for stale reports.

A report is considered stale if its assessment date is more than STALE_DAYS old.
The assessment date is parsed from the `**Assessment Date:**` line in the report
header; if that line includes one or more "(updated <date>)" annotations, the
latest date wins. If no date can be parsed, falls back to the file's last git
commit date.

Existing open issues with the `reassessment` label and matching title are not
re-created, so the workflow is safe to run repeatedly.
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
STALE_DAYS = 60
LABEL = "reassessment"
TITLE_PREFIX = "Reassessment: "

ASSESSMENT_LINE_RE = re.compile(r"\*\*Assessment Date:\*\*\s*([^\n]+)", re.IGNORECASE)
DATE_RE = re.compile(
    r"\b("
    r"January|February|March|April|May|June|July|August|September|October|November|December"
    r")\s+(\d{1,2}),\s+(\d{4})\b"
)
TITLE_RE = re.compile(r"^#\s+(.+)$", re.MULTILINE)
SCORE_RE = re.compile(r"\*\*Final Score:\s*([\d.]+)\s*/\s*5\.0\*\*")

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger("stale-reports")


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
    title_match = TITLE_RE.search(content)
    title = title_match.group(1).strip() if title_match else path.stem
    score_match = SCORE_RE.search(content)
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


def repo_slug() -> str | None:
    return os.environ.get("GITHUB_REPOSITORY")


def build_issue_body(report: dict, days: int) -> str:
    repo = repo_slug()
    rel = f"reports/report/{report['slug']}.md"
    if repo:
        link = f"https://github.com/{repo}/blob/master/{rel}"
    else:
        link = rel
    date_str = report["date"].date().isoformat() if report["date"] else "unknown"
    score_str = f"{report['score']}/5.0" if report["score"] else "unknown"
    return (
        f"The risk assessment **{report['title']}** has not been updated in "
        f"{days} days and is due for reassessment.\n\n"
        f"- **Report:** [`{rel}`]({link})\n"
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


def main() -> int:
    dry_run = os.environ.get("DRY_RUN", "").lower() in ("1", "true", "yes")
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=STALE_DAYS)

    if not REPORTS_DIR.is_dir():
        log.error("reports directory not found: %s", REPORTS_DIR)
        return 1

    if dry_run:
        log.info("DRY-RUN enabled — no issues will be created")
    existing_titles = open_reassessment_titles()
    log.info("found %d existing open reassessment issues", len(existing_titles))

    stale_count = 0
    skipped_count = 0
    failed_count = 0
    for path in sorted(REPORTS_DIR.glob("*.md")):
        report = parse_report(path)
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
        "done: %d new issue(s), %d skipped (already open), %d failed",
        stale_count,
        skipped_count,
        failed_count,
    )
    return 1 if failed_count else 0


if __name__ == "__main__":
    sys.exit(main())
