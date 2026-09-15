"""Publish a file to Yearn Artifacts: uv run python -m scripts.post_artifact."""

import argparse
import json
import os
from http.client import HTTPException, InvalidURL
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import quote, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

from scripts.env import load_repo_env, required_env

DEFAULT_URL = "https://artifacts.yearn.dev"
RETENTIONS = ("1d", "7d", "30d", "90d", "1y", "archive")
PROVENANCE_FIELDS = ("repository", "scanner", "ref", "commit")
UNCERTAIN_UPLOAD = "The upload may have succeeded; do not retry automatically."


class NoRedirects(HTTPRedirectHandler):
    """Keep authenticated uploads at the configured destination."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def publish_url(file: Path, service_url: str, retention: str) -> str:
    """Build the upload endpoint, preserving the file extension.

    Args:
        file: File to publish.
        service_url: Configured HTTP(S) service base URL.
        retention: Supported expiration tier.

    Returns:
        Upload URL with the retention prefix and encoded filename.

    Raises:
        ValueError: The URL or retention is invalid.
    """
    if retention not in RETENTIONS:
        raise ValueError(f"Invalid retention; choose from {', '.join(RETENTIONS)}")
    parsed = urlsplit(service_url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        raise ValueError("ARTIFACTS_URL must be an absolute HTTP(S) service URL")
    if parsed.scheme == "http" and parsed.hostname not in (
        "localhost",
        "127.0.0.1",
        "::1",
    ):
        raise ValueError("ARTIFACTS_URL must use HTTPS outside localhost")
    if parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise ValueError(
            "ARTIFACTS_URL must not contain credentials, a query, or a fragment"
        )
    prefix = "" if retention == "30d" else f"/{retention}"
    return f"{service_url.rstrip('/')}{prefix}/{quote(file.name, safe='')}"


def _headers(api_key: str, provenance: dict[str, str]) -> dict[str, str]:
    if not api_key.strip():
        raise ValueError("Set ARTIFACTS_API_KEY in the repository .env or environment")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/octet-stream",
        "User-Agent": "yearn-risk-score/post-artifact",
    }
    for field in PROVENANCE_FIELDS:
        value = provenance.get(field)
        if value:
            headers[f"X-Report-{field}"] = value
    for value in headers.values():
        if not value.isascii() or not value.isprintable():
            raise ValueError("API key and metadata must contain only printable ASCII")
    return headers


def _send(request: Request) -> object:
    try:
        with build_opener(NoRedirects).open(request, timeout=60) as response:
            return json.load(response)
    except HTTPError as error:
        error.close()
        if error.code >= 500:
            raise ValueError(
                f"Artifact service returned HTTP {error.code}. {UNCERTAIN_UPLOAD}"
            ) from None
        raise ValueError(
            f"Artifact publish failed (HTTP {error.code}); check credentials, URL, and service. "
            "No retry was made."
        ) from None
    except InvalidURL:
        raise ValueError(
            "Invalid ARTIFACTS_URL; check its host, port, and path"
        ) from None
    except (OSError, HTTPException):
        raise ValueError(
            f"Artifact upload connection or response failed. {UNCERTAIN_UPLOAD}"
        ) from None
    except ValueError:
        raise ValueError(
            f"Artifact service returned invalid JSON. {UNCERTAIN_UPLOAD}"
        ) from None


def post_artifact(
    file: Path,
    *,
    api_key: str,
    service_url: str = DEFAULT_URL,
    retention: str = "30d",
    provenance: dict[str, str] | None = None,
) -> dict[str, str]:
    """Publish once and return the service's artifact key and URL.

    Args:
        file: File whose bytes will be uploaded.
        api_key: Yearn Artifacts bearer credential.
        service_url: Service base URL.
        retention: Expiration tier, defaulting to 30 days.
        provenance: Optional repository, scanner, ref, and commit metadata.

    Returns:
        The key and URL returned by the service, unchanged.

    Raises:
        ValueError: Configuration, file, HTTP request, or response is invalid.
    """
    url = publish_url(file, service_url, retention)
    headers = _headers(api_key, provenance or {})
    try:
        body = file.read_bytes()
    except OSError:
        raise ValueError(
            f"Cannot read artifact file: {file}; check the path and permissions"
        ) from None
    result = _send(Request(url, data=body, headers=headers, method="POST"))
    if not isinstance(result, dict) or not all(
        isinstance(result.get(field), str) and result[field].strip()
        for field in ("key", "url")
    ):
        raise ValueError(
            f"Artifact response is missing a key or URL. {UNCERTAIN_UPLOAD}"
        )
    return {"key": result["key"], "url": result["url"]}


def main() -> None:
    """Load repository configuration and publish the requested file."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", type=Path, required=True)
    parser.add_argument("--retention", choices=RETENTIONS, default="30d")
    for field in PROVENANCE_FIELDS:
        parser.add_argument(f"--{field}")
    args = parser.parse_args()
    load_repo_env(Path(__file__))
    try:
        result = post_artifact(
            args.file,
            api_key=required_env("ARTIFACTS_API_KEY"),
            service_url=os.getenv("ARTIFACTS_URL") or DEFAULT_URL,
            retention=args.retention,
            provenance={field: getattr(args, field) for field in PROVENANCE_FIELDS},
        )
    except ValueError as error:
        parser.exit(1, f"{error}\n")
    print(json.dumps(result))


if __name__ == "__main__":
    main()
