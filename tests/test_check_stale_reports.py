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
        self.scope.write_text('["asset"]')

        self.assertEqual(
            stale_reports.load_reassessment_reports(),
            [self.reports / "asset.md", self.reports / "yearn-vault.md"],
        )

    def test_empty_list_is_valid(self):
        self.scope.write_text("[]")

        self.assertEqual(stale_reports.load_reassessment_reports(), [])

    def test_empty_dependency_list_still_includes_new_yearn_reports(self):
        self.scope.write_text("[]")
        self.write_report("yearn-new-vault")
        self.write_report("unlisted")

        self.assertEqual(
            stale_reports.load_reassessment_reports(),
            [self.reports / "yearn-new-vault.md"],
        )

    def test_yearn_reports_must_not_be_duplicated_in_dependency_list(self):
        self.scope.write_text('["yearn-vault"]')

        with self.assertRaisesRegex(ValueError, "discovered automatically"):
            stale_reports.load_reassessment_reports()

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

    def test_unsorted_list_is_rejected(self):
        self.scope.write_text('["z-asset", "a-asset"]')

        with self.assertRaisesRegex(ValueError, "sorted alphabetically"):
            stale_reports.load_reassessment_reports()

    def test_missing_report_is_retained_for_scan_error_reporting(self):
        self.scope.write_text('["missing-asset"]')

        self.assertEqual(
            stale_reports.load_reassessment_reports(),
            [self.reports / "missing-asset.md"],
        )

    def test_bad_report_does_not_prevent_other_issues_and_returns_failure(self):
        for failure in ("missing", "directory", "encoding"):
            with self.subTest(failure=failure):
                self.write_report("valid-asset")
                slug = f"bad-{failure}"
                bad = self.reports / f"{slug}.md"
                if failure == "directory":
                    bad.mkdir()
                if failure == "encoding":
                    bad.write_bytes(b"\xff")
                self.scope.write_text(json.dumps([slug, "valid-asset"]))
                with (
                    mock.patch.dict(
                        os.environ,
                        {"DRY_RUN": "", "GITHUB_REPOSITORY": "yearn/risk-score"},
                    ),
                    mock.patch.object(
                        stale_reports.subprocess, "check_output", return_value="[]"
                    ),
                    mock.patch.object(stale_reports.subprocess, "run") as create,
                    self.assertLogs(stale_reports.log, level="ERROR") as logs,
                ):
                    self.assertEqual(stale_reports.main(), 1)

                self.assertIn(f"{slug}.md", logs.output[0])
                self.assertIn("continuing", logs.output[0])
                self.assertEqual(create.call_count, 1)
                self.assertEqual(
                    create.call_args.args[0][4], "Reassessment: valid-asset"
                )

    def test_invalid_list_stops_scan_before_github_operations(self):
        self.scope.write_text("{broken")
        with (
            mock.patch.object(stale_reports.subprocess, "check_output") as read,
            mock.patch.object(stale_reports.subprocess, "run") as write,
            self.assertLogs(stale_reports.log, level="ERROR") as logs,
        ):
            self.assertEqual(stale_reports.main(), 1)

        self.assertIn("fix the report list", logs.output[0])
        read.assert_not_called()
        write.assert_not_called()

    def test_scan_only_creates_issues_for_eligible_stale_reports(self):
        self.write_report("asset")
        self.write_report("yearn-vault")
        self.write_report("unlisted")
        self.write_report("terminal", status="DEAD")
        self.write_report("fresh", days=1)
        self.write_report("existing")
        self.scope.write_text(json.dumps(["asset", "existing", "fresh", "terminal"]))
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

    def test_dry_run_requires_no_github_commands_or_authentication(self):
        self.write_report("asset")
        self.scope.write_text('["asset"]')
        with (
            mock.patch.dict(
                os.environ,
                {"DRY_RUN": "true", "GITHUB_REPOSITORY": "yearn/risk-score"},
                clear=True,
            ),
            mock.patch.object(
                stale_reports.subprocess,
                "check_output",
                side_effect=FileNotFoundError("no gh"),
            ) as read,
            mock.patch.object(stale_reports.subprocess, "run") as create,
        ):
            self.assertEqual(stale_reports.main(), 0)

        read.assert_not_called()
        create.assert_not_called()

    def test_live_scan_flags_open_issues_for_removed_slugs(self):
        self.write_report("asset", days=1)
        self.scope.write_text('["asset"]')
        with (
            mock.patch.dict(os.environ, {"DRY_RUN": ""}),
            mock.patch.object(
                stale_reports.subprocess,
                "check_output",
                return_value=json.dumps(
                    [
                        {"title": "Reassessment: asset"},
                        {"title": "Reassessment: removed"},
                        {"title": "Manual reassessment checklist"},
                    ]
                ),
            ),
            mock.patch.object(stale_reports.subprocess, "run") as create,
            self.assertLogs(stale_reports.log, level="WARNING") as logs,
        ):
            self.assertEqual(stale_reports.main(), 0)

        self.assertEqual(len(logs.output), 1)
        self.assertIn("OUT-OF-SCOPE Reassessment: removed", logs.output[0])
        create.assert_not_called()

    def test_missing_selected_report_is_not_flagged_as_removed(self):
        self.scope.write_text('["missing"]')
        with self.assertNoLogs(stale_reports.log, level="WARNING"):
            stale_reports.flag_out_of_scope_issues(
                stale_reports.load_reassessment_reports(), {"Reassessment: missing"}
            )


class RepositoryReassessmentListTests(unittest.TestCase):
    def test_committed_list_is_valid_and_contains_all_yearn_reports(self):
        paths = stale_reports.load_reassessment_reports()
        self.assertEqual(
            [str(path) for path in paths if not path.is_file()],
            [],
            "Update reports/reassessment.json when renaming or deleting a listed report",
        )
        selected = {path.stem for path in paths}
        yearn_reports = {
            path.stem for path in stale_reports.REPORTS_DIR.glob("yearn-*.md")
        }

        self.assertTrue(yearn_reports)
        self.assertLessEqual(yearn_reports, selected)


if __name__ == "__main__":
    unittest.main()
