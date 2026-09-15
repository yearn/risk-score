"""Publish a file to Yearn Artifacts: uv run python -m scripts.post_artifact."""

import argparse
import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

from scripts.env import load_repo_env, required_env

DEFAULT_URL = "https://artifacts.yearn.dev"
RETENTIONS = ("1d", "7d", "30d", "90d", "1y", "archive")


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
    }
    for field in ("repository", "scanner", "ref", "commit"):
        value = provenance.get(field)
        if value:
            headers[f"X-Report-{field}"] = value
    try:
        for value in headers.values():
            value.encode("latin-1")
            if "\r" in value or "\n" in value:
                raise ValueError
    except (UnicodeError, ValueError):
        raise ValueError(
            "API key and metadata must be single-line HTTP header values"
        ) from None
    return headers


def _send(request: Request) -> object:
    try:
        with build_opener(NoRedirects).open(request, timeout=60) as response:
            return json.load(response)
    except HTTPError as error:
        error.close()
        raise ValueError(
            f"Artifact publish failed (HTTP {error.code}); check credentials, URL, and service. "
            "No retry was made."
        ) from None
    except (URLError, OSError):
        raise ValueError(
            "Artifact upload connection failed; check the service and network. "
            "The upload may have succeeded; do not retry automatically."
        ) from None
    except (ValueError, UnicodeError):
        raise ValueError(
            "Artifact service returned invalid JSON; the upload may have succeeded. "
            "Do not retry automatically."
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
            "Artifact response is missing a key or URL; the upload may have succeeded. "
            "Do not retry automatically."
        )
    return {"key": result["key"], "url": result["url"]}


def main() -> None:
    """Load repository configuration and publish the requested file."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", type=Path, required=True)
    parser.add_argument("--retention", choices=RETENTIONS, default="30d")
    for field in ("repository", "scanner", "ref", "commit"):
        parser.add_argument(f"--{field}")
    args = parser.parse_args()
    load_repo_env(Path(__file__))
    try:
        result = post_artifact(
            args.file,
            api_key=required_env("ARTIFACTS_API_KEY"),
            service_url=os.getenv("ARTIFACTS_URL") or DEFAULT_URL,
            retention=args.retention,
            provenance={
                field: getattr(args, field)
                for field in ("repository", "scanner", "ref", "commit")
            },
        )
    except ValueError as error:
        parser.exit(1, f"{error}\n")
    print(json.dumps(result))


if __name__ == "__main__":
    main()
