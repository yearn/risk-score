# Known bugs

## Yearn Artifacts uploader — PR #473, fixed 2026-09-15

- **Uncaught protocol errors:** `_send` omitted `HTTPException`, so incomplete
  responses and malformed status lines escaped the CLI after upload.
- **Malformed URL tracebacks:** missing `InvalidURL` handling exposed raw errors
  for non-numeric ports and spaces in the service URL.
- **Misleading 5xx errors:** the generic HTTP failure message omitted uncertainty
  about whether the upload was stored.
- **Invalid header bytes:** validation rejected CR/LF but allowed other controls.
- **Missing test coverage in CI:** no workflow invoked `tests.test_post_artifact`.

Verified using harmless temporary files and a loopback HTTP server; no production
uploads were made. All five findings were fixed in the PR follow-up and are covered
by regression tests or the new artifact-test workflow.
