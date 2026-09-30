import unittest

import scripts.check_dependency_coverage as coverage


class FindCoverageIssuesTests(unittest.TestCase):
    def test_in_sync_reports_no_issues(self):
        issues = coverage.find_coverage_issues(
            reports={"maple-syrupusdc", "fluid", "yearn-yvusdc"},
            protocol_links={
                "maple": "maple-syrupusdc",
                "fluid_lending": "fluid",
                "spark": None,
            },
            upstream={"spark"},
            reports_without_protocol={"yearn-yvusdc"},
        )
        self.assertEqual(issues["missing"], [])
        self.assertEqual(issues["dangling"], [])
        self.assertEqual(issues["undeclared"], [])
        self.assertEqual(issues["duplicate"], {})
        self.assertEqual(issues["stale_allowlist"], [])

    def test_report_without_entry_is_missing(self):
        issues = coverage.find_coverage_issues(
            reports={"maple-syrupusdc", "cap-stcusd"},
            protocol_links={"maple": "maple-syrupusdc"},
            upstream=set(),
            reports_without_protocol=set(),
        )
        self.assertEqual(issues["missing"], ["cap-stcusd"])

    def test_allowlisted_report_is_not_missing(self):
        issues = coverage.find_coverage_issues(
            reports={"yearn-yvusdc"},
            protocol_links={},
            upstream=set(),
            reports_without_protocol={"yearn-yvusdc"},
        )
        self.assertEqual(issues["missing"], [])

    def test_report_field_pointing_at_missing_file_is_dangling(self):
        issues = coverage.find_coverage_issues(
            reports={"maple-syrupusdc"},
            protocol_links={"maple": "maple-renamed"},
            upstream=set(),
            reports_without_protocol=set(),
        )
        self.assertEqual(issues["dangling"], [("maple", "maple-renamed")])

    def test_entry_without_report_and_not_upstream_is_undeclared(self):
        issues = coverage.find_coverage_issues(
            reports=set(),
            protocol_links={"new_protocol": None},
            upstream=set(),
            reports_without_protocol=set(),
        )
        self.assertEqual(issues["undeclared"], ["new_protocol"])

    def test_upstream_entry_without_report_is_allowed(self):
        issues = coverage.find_coverage_issues(
            reports=set(),
            protocol_links={"spark": None},
            upstream={"spark"},
            reports_without_protocol=set(),
        )
        self.assertEqual(issues["undeclared"], [])

    def test_two_entries_pointing_at_same_report_is_duplicate(self):
        issues = coverage.find_coverage_issues(
            reports={"resolv"},
            protocol_links={"resolv_rlp": "resolv", "resolv_wstusr": "resolv"},
            upstream=set(),
            reports_without_protocol=set(),
        )
        self.assertEqual(
            issues["duplicate"], {"resolv": ["resolv_rlp", "resolv_wstusr"]}
        )

    def test_stale_upstream_allowlist_when_entry_gains_report(self):
        issues = coverage.find_coverage_issues(
            reports={"spark-report"},
            protocol_links={"spark": "spark-report"},
            upstream={"spark"},
            reports_without_protocol=set(),
        )
        self.assertEqual(len(issues["stale_allowlist"]), 1)
        self.assertIn("spark", issues["stale_allowlist"][0])

    def test_stale_reports_allowlist_when_report_gains_entry(self):
        issues = coverage.find_coverage_issues(
            reports={"yearn-yvusdc"},
            protocol_links={"yearn_vault": "yearn-yvusdc"},
            upstream=set(),
            reports_without_protocol={"yearn-yvusdc"},
        )
        self.assertEqual(len(issues["stale_allowlist"]), 1)
        self.assertIn("yearn-yvusdc", issues["stale_allowlist"][0])


class RealRepoCoverageTests(unittest.TestCase):
    """The committed protocols.yaml and reports must be in sync."""

    def test_repo_is_green(self):
        issues = coverage.find_coverage_issues(
            coverage.report_slugs(), coverage.protocol_report_links()
        )
        self.assertEqual(issues["missing"], [])
        self.assertEqual(issues["dangling"], [])
        self.assertEqual(issues["undeclared"], [])
        self.assertEqual(issues["duplicate"], {})
        self.assertEqual(issues["stale_allowlist"], [])


if __name__ == "__main__":
    unittest.main()
