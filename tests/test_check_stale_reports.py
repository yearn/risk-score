import os
import tempfile
import unittest
from datetime import datetime, timezone
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
            "- **Report:** [cap-stcusd](https://risk.yearn.farm/report/cap-stcusd/)",
            body,
        )
        self.assertIn(
            "- **Source:** [`reports/report/cap-stcusd.md`](https://github.com/yearn/risk-score/blob/master/reports/report/cap-stcusd.md)",
            body,
        )
        self.assertIn("- **Last Assessment Date:** 2026-03-20 (source: report-header)", body)
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


if __name__ == "__main__":
    unittest.main()
