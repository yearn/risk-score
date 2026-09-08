# Fetching JS-rendered sources

Issue links often point at Google Docs, Notion, or GitBook. A static HTTP fetch
can return only a shell or login page. Try the host's data endpoint below.

**Google Docs** (link-shared "anyone with the link"):

```bash
# File id from .../document/d/<FILE_ID>/edit
curl -sL "https://docs.google.com/document/d/<FILE_ID>/export?format=txt" -o /tmp/doc.txt
grep -qi "accounts.google\|sign in" /tmp/doc.txt && echo "LOGIN WALL" || echo "OK"
```

`format=txt` gives clean text; `format=html` preserves structure. A login page
means the doc is private — ask for an export rather than guessing at contents.

**Notion** (public and published pages, including `*.notion.site`):

```bash
# URL ends in ...-<32-hex-pageid>. Hyphenate into a UUID:
#   328723f942ca80adb0a0ced3adf5a0b8 -> 328723f9-42ca-80ad-b0a0-ced3adf5a0b8
curl -s "https://<subdomain>.notion.site/api/v3/loadCachedPageChunkV2" \
  -H "Content-Type: application/json" \
  --data '{"page":{"id":"<UUID>"},"limit":300,"cursor":{"stack":[]},"verticalColumns":false}' \
  -o /tmp/page.json
```

Parse in Python. **Gotcha:** the block value is double-nested — read
`recordMap.block[id]["value"]["value"]`, not `["value"]`. Walk the page's
`content` array recursively; each block's human text is `properties.title`, a
list of rich-text segments `[["text", ...], ...]` — join `seg[0]`. Map `type` to
markdown (`header`→`#`, `sub_header`→`##`, `bulleted_list`→`- `). If a fresh
request returns skeleton blocks with no `value`, retry — Notion sometimes serves
a cached chunk first.

**GitBook** (e.g. `*.gitbook.io`) — two tricks:

- Append `.md` to any page URL for clean markdown:
  `https://<proj>.gitbook.io/<space>/<page>.md`.
- Many GitBook sites expose a Q&A endpoint — GET the `.md` URL with an
  `ask=<question>` param for a direct answer plus sourced excerpts:

  ```bash
  curl -sL --get "https://<proj>.gitbook.io/<space>/<page>.md" \
    --data-urlencode "ask=List every audit: firm, date, scope, and report link."
  ```

  Useful for filling gaps without reading every page. It only knows the docs
  *text* — content inside linked PDFs (often the audit firm names) is not
  returned. The docs root is often behind a Cloudflare challenge; if `curl`
  returns "Just a moment…", target a sub-page or use a browser if available.
