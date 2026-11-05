# Known bugs

- **Cloudflare publication secrets were not forwarded (fixed in PR #579 review).**
  Reusable workflow callers omitted named secrets, leaving publication credentials empty.
- **Computed secret access widened credential exposure (fixed in PR #579 review).**
  Dynamic secret indexing materialized a broader secret context instead of selecting literal names.
- **Production publication could overlap cancellation (fixed in PR #579 review).**
  A later push could cancel a publication with remote operations in progress without a shared lock.
- **Worker failures lacked persistent diagnostics (fixed in PR #579 review).**
  Exception handlers suppressed failures and deployment configuration did not explicitly retain logs.
