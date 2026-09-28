---
name: post-artifact
description: Publish a report, scan result, or other file to Yearn Artifacts and return its URL. Use when asked to upload or publish a file to artifacts.yearn.dev, or share a report through Yearn Artifacts.
---

# Publish to Yearn Artifacts

## Contents

- [Workflow](#workflow)
- [Configuration](#configuration)
- [Retention and metadata](#retention-and-metadata)
- [Result and failures](#result-and-failures)

## Workflow

Adapted from the [Yearn WebOps skill](https://github.com/yearn/webops-skills/blob/main/skills/post-artifact/SKILL.md)
and its [upload client](https://github.com/yearn/webops-skills/blob/main/skills/post-artifact/scripts/post-artifact.ts).
Use this repo's [Python helper](../../../scripts/post_artifact.py).

1. Identify the file the user wants published. If creating it is part of the
   request, finish and verify the content first. For risk assessment authoring,
   follow the relevant report skill before publishing.
2. Read the final file and check that it contains the intended content. Replace
   repository-relative links with appropriate absolute links so they work on
   the artifact site; preserve the source and prepare a separate upload copy
   when needed. Keep the file extension: Markdown renders as HTML, while other
   formats are served as stored bytes.
3. Publish when the user has requested uploading or publishing this content.
   A request to create a report or install this skill alone does not authorize
   publication. If publication was not requested, prepare the file before
   asking for approval. Reads are unauthenticated: anyone with the URL can read
   it. Never upload credentials or send the resulting link to other channels
   without the user's instruction.
4. Run from this repository root:

   ```bash
   uv run python -m scripts.post_artifact --file ./REPORT.md
   ```

## Configuration

Set `ARTIFACTS_API_KEY` in the repository-root `.env` or the process environment.
The helper uses `scripts.env.load_repo_env()` and preserves existing environment
values. In a worktree, load the original checkout's `.env` into the publishing
process if needed. Never print the key or pass it on the command line.

`ARTIFACTS_URL` optionally overrides `https://artifacts.yearn.dev`. HTTPS is required
except for local testing at `localhost`, `127.0.0.1`, or `::1`. Use an override
only for the destination intended by the user. Missing credentials block the
upload; ask the user to configure `ARTIFACTS_API_KEY` without exposing its value.

## Retention and metadata

The default lifetime is **30 days**. Use `--retention` only for a lifetime requested
by the user or already specified by the workflow. Supported values: `1d`, `7d`,
`30d`, `90d`, `1y`, `archive`. Use `archive` only on an explicit request for no
automatic expiration. Do not ask about retention when the default is suitable.

Supply known provenance through optional flags. These values appear in the
rendered report footer. Use the actual source repository, ref, and commit; do not
invent them or imply that uncommitted content matches a committed revision.
For example, when publishing from this repo with a requested seven-day lifetime:

```bash
uv run python -m scripts.post_artifact \
  --file ./REPORT.md \
  --repository yearn/risk-score \
  --retention 7d
```

Additional metadata flags are `--scanner`, `--ref`, and `--commit`. Values must use
printable ASCII. Include only values that describe the artifact.

## Result and failures

The helper prints JSON containing `key` and `url`. Return the **exact URL** from
the response and the retention used. The URL is the only lookup handle: stored
names are random and there is no index. Non-default retention can add a tier
prefix; never reconstruct or shorten the returned URL.

Each upload creates a new artifact, including repeat uploads of identical bytes.
The helper makes one attempt and does not follow redirects. After a timeout,
invalid response, or server error (HTTP 5xx), report that publication is uncertain
and do not retry automatically. On failure, provide the error without claiming a URL exists.

Deleting an artifact requires a separate user request: the service accepts
`DELETE` at the returned URL with the same bearer key.
