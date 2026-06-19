import os
import unittest
from datetime import datetime, timezone
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


if __name__ == "__main__":
    unittest.main()
