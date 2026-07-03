# Wall of love (site directory)

`wall-of-love.json` is the **curated** list shown on
[openredaction.com/community](/community) and the homepage.

## How entries get here

1. Someone posts in GitHub Discussions:
   [**Who's using Open Redaction?**](https://github.com/sam247/openredaction/discussions/28)
   (or the current pinned thread).
2. You confirm they agreed to be listed (`yes` to listing on openredaction.com).
3. Add a JSON object via PR (submitter or maintainer).

## Schema

```json
[
  {
    "name": "Company or project name",
    "url": "https://optional-link.example",
    "logoUrl": "https://optional-absolute-url-to-logo.png",
    "quote": "Optional one-line quote.",
    "discussionUrl": "Optional link to their discussion comment for traceability"
  }
]
```

- `name` — required.
- All other fields — optional.
- Use **HTTPS** URLs for `url`, `logoUrl`, and `discussionUrl`.
