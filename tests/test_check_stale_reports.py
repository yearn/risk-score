import json
import os
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest import mock

import scripts.check_stale_reports as stale_reports


def sample_report() -> dict:
    return {
        "slug": "cap-stcusd",
        "title": "Protocol Risk Assessment: Cap - stcUSD",
        "score": "2.4",
        "date": datetime(2026, 3, 20, tzinfo=timezone.utc),
        "date_source": "report-header",
    }


class BuildIssueBodyTests(unittest.TestCase):
    def test_body_uses_absolute_public_and_source_links_with_github_repository(self):
        with mock.patch.dict(os.environ, {"GITHUB_REPOSITORY": "yearn/risk-score"}):
            body = stale_reports.build_issue_body(sample_report(), days=68)

        self.assertIn(
            "- **Report:** [cap-stcusd](https://curation.yearn.fi/report/cap-stcusd/)",
            body,
        )
        self.assertIn(
            "- **Source:** [`reports/report/cap-stcusd.md`](https://github.com/yearn/risk-score/blob/master/reports/report/cap-stcusd.md)",
            body,
        )
        self.assertIn(
            "- **Last Assessment Date:** 2026-03-20 (source: report-header)", body
        )
        self.assertIn("- **Current Score:** 2.4/5.0", body)
        self.assertIn("- **Days Since Last Assessment:** 68", body)
        self.assertIn("- **Threshold:** 60 days", body)

    def test_body_without_github_repository_still_has_no_relative_source_link(self):
        with (
            mock.patch.dict(os.environ, {}, clear=True),
            mock.patch.object(stale_reports, "git_remote_repo_slug", return_value=None),
        ):
            body = stale_reports.build_issue_body(sample_report(), days=68)

        self.assertNotIn("](reports/report/cap-stcusd.md)", body)
        self.assertIn(
            "- **Source:** [`reports/report/cap-stcusd.md`](https://github.com/yearn/risk-score/blob/master/reports/report/cap-stcusd.md)",
            body,
        )

    def test_repo_slug_falls_back_to_github_remote_origin(self):
        with (
            mock.patch.dict(os.environ, {}, clear=True),
            mock.patch.object(
                stale_reports.subprocess,
                "check_output",
                return_value="git@github.com:yearn/risk-score.git\n",
            ),
        ):
            self.assertEqual(stale_reports.repo_slug(), "yearn/risk-score")


class ParseReportTests(unittest.TestCase):
    def parse_content(self, content: str) -> dict:
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "sample.md"
            path.write_text(content)
            return stale_reports.parse_report(path)

    def test_terminal_status_in_header_is_extracted(self):
        report = self.parse_content(
            "# Protocol Risk Assessment: Dead Project\n\n"
            "- **Assessment Date:** March 3, 2026\n"
            "- **Final Score: N/A**\n"
            "- **Status:** DEAD\n\n"
            "## Overview + Links\n"
        )

        self.assertEqual(report["terminal_status"], "DEAD")

    def test_hacked_status_with_annotation_is_extracted(self):
        report = self.parse_content(
            "# Protocol Risk Assessment: Hacked Project\n\n"
            "- **Assessment Date:** February 8, 2026 (Updated: March 22, 2026)\n"
            "- **Final Score: N/A**\n"
            "- **Status:** HACKED (March 22, 2026)\n\n"
            "## Overview + Links\n"
        )

        self.assertEqual(report["terminal_status"], "HACKED")

    def test_caution_status_does_not_skip_reassessment(self):
        report = self.parse_content(
            "# Protocol Risk Assessment: Gated Project\n\n"
            "- **Assessment Date:** March 3, 2026\n"
            "- **Final Score: 3.2/5.0**\n"
            "- **Status:** GATED -- score capped by a critical gate\n\n"
            "## Overview + Links\n"
        )

        self.assertIsNone(report["terminal_status"])

    def test_body_status_line_is_ignored(self):
        report = self.parse_content(
            "# Protocol Risk Assessment: Active Project\n\n"
            "- **Assessment Date:** March 3, 2026\n"
            "- **Final Score: 2.4/5.0**\n\n"
            "## Overview + Links\n\n"
            "**Status:** HACKED appears in quoted third-party content.\n"
        )

        self.assertIsNone(report["terminal_status"])


class ReassessmentListTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        self.reports = self.root / "report"
        self.reports.mkdir()
        self.scope = self.root / "reassessment.json"
        for name, value in (
            ("REPORTS_DIR", self.reports),
            ("REASSESSMENT_LIST", self.scope),
        ):
            patch = mock.patch.object(stale_reports, name, value)
            patch.start()
            self.addCleanup(patch.stop)

    def write_report(self, slug: str, days: int = 90, status: str = ""):
        date = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%B %d, %Y")
        (self.reports / f"{slug}.md").write_text(
            f"# Protocol Risk Assessment: {slug}\n\n"
            f"- **Assessment Date:** {date}\n"
            "- **Final Score: 2.4/5.0**\n"
            f"- **Status:** {status}\n\n"
            "## Overview + Links\n"
        )

    def test_list_resolves_only_selected_reports_in_sorted_order(self):
        for slug in ("yearn-vault", "asset", "unlisted"):
            self.write_report(slug)
        self.scope.write_text(json.dumps(["yearn-vault", "asset"]))

        self.assertEqual(
            stale_reports.load_reassessment_reports(),
            [self.reports / "asset.md", self.reports / "yearn-vault.md"],
        )

    def test_empty_list_is_valid(self):
        self.scope.write_text("[]")

        self.assertEqual(stale_reports.load_reassessment_reports(), [])

    def test_missing_list_has_actionable_error(self):
        with self.assertRaisesRegex(ValueError, "cannot read .*reassessment.json"):
            stale_reports.load_reassessment_reports()

    def test_malformed_json_has_actionable_error(self):
        self.scope.write_text("[broken")

        with self.assertRaisesRegex(ValueError, "fix the report list"):
            stale_reports.load_reassessment_reports()

    def test_invalid_encoding_has_actionable_error(self):
        self.scope.write_bytes(b"\xff")

        with self.assertRaisesRegex(ValueError, "fix the report list"):
            stale_reports.load_reassessment_reports()

    def test_non_array_is_rejected(self):
        for value in ({"reports": []}, None, "yearn-vault", 42):
            with self.subTest(value=value):
                self.scope.write_text(json.dumps(value))
                with self.assertRaisesRegex(ValueError, "JSON array"):
                    stale_reports.load_reassessment_reports()

    def test_invalid_slugs_are_rejected(self):
        for value in (None, 1, {}, [], "", "../secret", "asset.md", "/asset", "Asset"):
            with self.subTest(value=value):
                self.scope.write_text(json.dumps([value]))
                with self.assertRaisesRegex(ValueError, "invalid report slugs"):
                    stale_reports.load_reassessment_reports()

    def test_duplicates_are_rejected(self):
        self.scope.write_text('["asset", "asset"]')

        with self.assertRaisesRegex(ValueError, "duplicate report slugs"):
            stale_reports.load_reassessment_reports()

    def test_missing_report_is_rejected(self):
        self.scope.write_text('["missing-asset"]')

        with self.assertRaisesRegex(ValueError, "missing reports: .*missing-asset.md"):
            stale_reports.load_reassessment_reports()

    def test_directory_is_not_accepted_as_a_report(self):
        (self.reports / "asset.md").mkdir()
        self.scope.write_text('["asset"]')

        with self.assertRaisesRegex(ValueError, "missing reports"):
            stale_reports.load_reassessment_reports()

    def test_invalid_list_stops_scan_before_github_operations(self):
        self.scope.write_text('["missing-asset"]')
        with (
            mock.patch.object(stale_reports.subprocess, "check_output") as read,
            mock.patch.object(stale_reports.subprocess, "run") as write,
            self.assertLogs(stale_reports.log, level="ERROR") as logs,
        ):
            self.assertEqual(stale_reports.main(), 1)

        self.assertIn("missing-asset.md", logs.output[0])
        read.assert_not_called()
        write.assert_not_called()

    def test_scan_only_creates_issues_for_eligible_stale_reports(self):
        self.write_report("asset")
        self.write_report("yearn-vault")
        self.write_report("unlisted")
        self.write_report("terminal", status="DEAD")
        self.write_report("fresh", days=1)
        self.write_report("existing")
        self.scope.write_text(
            json.dumps(["asset", "yearn-vault", "terminal", "fresh", "existing"])
        )
        with (
            mock.patch.dict(
                os.environ, {"DRY_RUN": "", "GITHUB_REPOSITORY": "yearn/risk-score"}
            ),
            mock.patch.object(
                stale_reports.subprocess,
                "check_output",
                return_value='[{"title": "Reassessment: existing"}]',
            ),
            mock.patch.object(stale_reports.subprocess, "run") as create,
        ):
            self.assertEqual(stale_reports.main(), 0)

        titles = [call.args[0][4] for call in create.call_args_list]
        self.assertEqual(titles, ["Reassessment: asset", "Reassessment: yearn-vault"])

    def test_dry_run_does_not_create_issues(self):
        self.write_report("asset")
        self.scope.write_text('["asset"]')
        with (
            mock.patch.dict(os.environ, {"DRY_RUN": "true"}),
            mock.patch.object(
                stale_reports.subprocess, "check_output", return_value="[]"
            ),
            mock.patch.object(stale_reports.subprocess, "run") as create,
        ):
            self.assertEqual(stale_reports.main(), 0)

        create.assert_not_called()


class RepositoryReassessmentListTests(unittest.TestCase):
    def test_committed_list_is_valid_and_contains_all_yearn_reports(self):
        selected = {path.stem for path in stale_reports.load_reassessment_reports()}
        yearn_reports = {
            path.stem for path in stale_reports.REPORTS_DIR.glob("yearn-*.md")
        }

        self.assertTrue(yearn_reports)
        self.assertLessEqual(yearn_reports, selected)


if __name__ == "__main__":
    unittest.main()
