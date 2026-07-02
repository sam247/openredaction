# Changesets

## Adding a changeset

Before opening a PR that changes package behavior, add a changeset:

```bash
bunx changeset
```

This will prompt you to:

1. **Select packages** affected by your change
2. **Choose bump type** — patch (bug fix), minor (feature), or major (breaking
   change)
3. **Write a summary** — a human-readable description of the change

Commit the generated `.changeset/*.md` file alongside your code changes.

## How releases work

1. When your PR is merged to `main`, a bot opens a **"Version Packages" PR**
   that:
   - Bumps versions in all `package.json` files (all packages share one version)
   - Updates `CHANGELOG.md` in each package
   - Consumes (deletes) the pending changeset files

2. Merge the Version Packages PR to publish to npm and create a GitHub Release.
