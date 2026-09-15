"""Exercise artifact publishing against a local HTTP service."""

import contextlib
import io
import json
import os
import tempfile
import threading
import unittest
from http.client import BadStatusLine, IncompleteRead
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import TypedDict
from unittest.mock import patch

from scripts.post_artifact import RETENTIONS, main, post_artifact, publish_url

RESULT = {"key": "random.md", "url": "https://artifacts.example/7d/random.md"}


class ArtifactOptions(TypedDict, total=False):
    api_key: str
    service_url: str
    retention: str
    provenance: dict[str, str]


class ArtifactHandler(BaseHTTPRequestHandler):
    status = 201
    response_body = json.dumps(RESULT).encode()
    received: list[tuple[str, dict[str, str], bytes]] = []

    def do_POST(self):
        body = self.rfile.read(int(self.headers["Content-Length"]))
        self.received.append((self.path, dict(self.headers), body))
        self.send_response(self.status)
        self.send_header("Location", "/redirected.md")
        self.end_headers()
        self.wfile.write(self.response_body)

    def log_message(self, format, *args):
        pass


class PostArtifactTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.file = Path(directory.name) / "risk #1.md"
        self.file.write_bytes(b"# Report\n\nEvidence: \xc3\xa9\n")
        ArtifactHandler.status = 201
        ArtifactHandler.response_body = json.dumps(RESULT).encode()
        ArtifactHandler.received = []
        self.server = HTTPServer(("127.0.0.1", 0), ArtifactHandler)
        self.addCleanup(self.server.server_close)
        thread = threading.Thread(
            target=self.server.serve_forever,
            kwargs={"poll_interval": 0.01},
            daemon=True,
        )
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(self.server.shutdown)
        self.url = f"http://127.0.0.1:{self.server.server_port}"

    def test_upload_preserves_bytes_metadata_and_returned_url(self):
        result = post_artifact(
            self.file,
            api_key="test-key",
            service_url=self.url,
            retention="7d",
            provenance={
                "repository": "yearn/risk-score",
                "scanner": "risk",
                "ref": "main",
                "commit": "abc",
            },
        )
        self.assertEqual(result, RESULT)
        self.assertEqual(len(ArtifactHandler.received), 1)
        path, headers, body = ArtifactHandler.received[0]
        self.assertEqual(path, "/7d/risk%20%231.md")
        self.assertEqual(body, self.file.read_bytes())
        self.assertEqual(headers["Authorization"], "Bearer test-key")
        self.assertEqual(headers["Content-Type"], "application/octet-stream")
        self.assertEqual(headers["X-Report-Repository"], "yearn/risk-score")
        self.assertEqual(headers["X-Report-Scanner"], "risk")
        self.assertEqual(headers["X-Report-Ref"], "main")
        self.assertEqual(headers["X-Report-Commit"], "abc")

    def test_retention_paths_and_empty_file(self):
        self.file.write_bytes(b"")
        for retention in RETENTIONS:
            with self.subTest(retention=retention):
                prefix = "" if retention == "30d" else f"/{retention}"
                self.assertEqual(
                    publish_url(self.file, self.url + "/", retention),
                    f"{self.url}{prefix}/risk%20%231.md",
                )
        post_artifact(self.file, api_key="test-key", service_url=self.url)
        path, headers, body = ArtifactHandler.received[0]
        self.assertEqual(path, "/risk%20%231.md")
        self.assertEqual(body, b"")
        self.assertFalse(any(key.startswith("X-Report-") for key in headers))

    def test_invalid_inputs_never_upload(self):
        cases: list[ArtifactOptions] = [
            {"api_key": ""},
            {"api_key": "key\r\ninjected: value"},
            {"provenance": {"ref": "bad\nheader"}},
            {"provenance": {"ref": "bad\x00header"}},
            {"provenance": {"ref": "bad\x7fheader"}},
            {"provenance": {"ref": "café"}},
            {"provenance": {"ref": "\u2603"}},
            {"retention": "forever"},
            {"service_url": "file:///tmp/artifacts"},
            {"service_url": "https://user:secret@example.com"},
            {"service_url": "https://example.com?token=secret"},
            {"service_url": "https://example.com#fragment"},
        ]
        for overrides in cases:
            with self.subTest(overrides=overrides), self.assertRaises(ValueError):
                post_artifact(
                    self.file,
                    api_key=overrides.get("api_key", "test-key"),
                    service_url=overrides.get("service_url", self.url),
                    retention=overrides.get("retention", "30d"),
                    provenance=overrides.get("provenance"),
                )
        self.file.unlink()
        with self.assertRaisesRegex(ValueError, "Cannot read artifact file"):
            post_artifact(self.file, api_key="test-key", service_url=self.url)
        self.assertEqual(ArtifactHandler.received, [])

    def test_http_failures_and_redirects_are_not_retried_or_echoed(self):
        for status in (301, 307, 401, 413, 500, 502, 504):
            with self.subTest(status=status):
                ArtifactHandler.status = status
                ArtifactHandler.response_body = b"sensitive server details"
                ArtifactHandler.received = []
                with self.assertRaisesRegex(ValueError, f"HTTP {status}") as error:
                    post_artifact(self.file, api_key="test-key", service_url=self.url)
                self.assertNotIn("sensitive", str(error.exception))
                if status >= 500:
                    self.assertIn("may have succeeded", str(error.exception))
                self.assertEqual(len(ArtifactHandler.received), 1)

    def test_invalid_response_reports_uncertainty_without_retry(self):
        for body in (b"not json", b"\xff", b"[]", b"{}", b'{"key": 1, "url": "x"}'):
            with self.subTest(body=body):
                ArtifactHandler.response_body = body
                ArtifactHandler.received = []
                with self.assertRaisesRegex(ValueError, "may have succeeded"):
                    post_artifact(self.file, api_key="test-key", service_url=self.url)
                self.assertEqual(len(ArtifactHandler.received), 1)

    def test_network_errors_report_uncertainty_without_retry(self):
        for error in (TimeoutError(), IncompleteRead(b"{", 10), BadStatusLine("bad")):
            with (
                self.subTest(error=type(error).__name__),
                patch("scripts.post_artifact.build_opener") as opener,
            ):
                opener.return_value.open.side_effect = error
                with self.assertRaisesRegex(ValueError, "may have succeeded"):
                    post_artifact(self.file, api_key="test-key", service_url=self.url)
                self.assertEqual(opener.return_value.open.call_count, 1)

    def test_invalid_url_reports_configuration_error(self):
        for url in ("http://127.0.0.1:abc", self.url + "/bad path"):
            with (
                self.subTest(url=url),
                self.assertRaisesRegex(ValueError, "ARTIFACTS_URL"),
            ):
                post_artifact(self.file, api_key="test-key", service_url=url)
        self.assertEqual(ArtifactHandler.received, [])

    def test_plain_http_requires_local_destination(self):
        with self.assertRaisesRegex(ValueError, "HTTPS"):
            publish_url(self.file, "http://artifacts.yearn.dev", "30d")
        for host in ("localhost", "127.0.0.1", "[::1]"):
            url = f"http://{host}:8000"
            self.assertTrue(publish_url(self.file, url, "30d").startswith(url))

    def test_cli_loads_env_and_prints_json(self):
        env_file = self.file.parent / ".env"
        env_file.write_text(f"ARTIFACTS_API_KEY=dotenv-key\nARTIFACTS_URL={self.url}\n")
        output = io.StringIO()
        with (
            patch(
                "scripts.post_artifact.__file__", str(self.file.parent / "publisher.py")
            ),
            patch.dict(
                os.environ, {"ARTIFACTS_API_KEY": "environment-key"}, clear=True
            ),
            patch("sys.argv", ["post_artifact", "--file", str(self.file)]),
            contextlib.redirect_stdout(output),
        ):
            main()
        self.assertEqual(json.loads(output.getvalue()), RESULT)
        self.assertEqual(
            ArtifactHandler.received[0][1]["Authorization"], "Bearer environment-key"
        )

    def test_missing_credentials_fails_before_network(self):
        with (
            patch("scripts.post_artifact.load_repo_env"),
            patch.dict(os.environ, {}, clear=True),
            patch("sys.argv", ["post_artifact", "--file", str(self.file)]),
            contextlib.redirect_stderr(io.StringIO()) as errors,
            self.assertRaises(SystemExit) as exit_error,
        ):
            main()
        self.assertEqual(exit_error.exception.code, 1)
        self.assertIn("ARTIFACTS_API_KEY", errors.getvalue())
        self.assertEqual(ArtifactHandler.received, [])


if __name__ == "__main__":
    unittest.main()
