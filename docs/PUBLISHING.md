# Publishing to npm

All 6 packages are published to npm using [Changesets](https://github.com/changesets/changesets):

- `@openredaction/core`
- `@openredaction/cli`
- `@openredaction/compat` (published as `openredaction` — the umbrella package)
- `@openredaction/server`
- `@openredaction/express`
- `@openredaction/react`

All packages share a single version (fixed mode). The `openredaction-site` package is private and never published.

## One-time setup

### 1. Create an npm account (if needed)

- Sign up at [npmjs.com](https://www.npmjs.com/signup).

### 2. Create an Automation token

- **npm requires 2FA** (or a granular token with "bypass 2FA") to publish. Enable 2FA first: npm → Profile → Account → Two-factor authentication.
- Log in at [npmjs.com](https://www.npmjs.com/).
- Profile (top right) → **Access Tokens** → **Generate New Token** → **Automation** (or **Classic** → "Automation").
- Copy the token (starts with `npm_`). You won't see it again.

### 3. Add the token to GitHub

- Repo → **Settings** → **Secrets and variables** → **Actions**.
- **New repository secret**: name = `NPM_TOKEN`, value = the token you copied (no trailing newline).
- Save.

**Token expiry:** npm Automation tokens expire after **90 days**. When publish fails with auth errors, create a new token at npmjs.com and update the `NPM_TOKEN` secret in this repo.

## Releasing a new version

### Step 1: Add a changeset to your PR

Before opening a PR that changes package behavior, run:

```bash
bunx changeset
```

This prompts you to:

1. **Select packages** affected by your change
2. **Choose bump type** — patch (bug fix), minor (feature), or major (breaking change)
3. **Write a summary** — a human-readable description that will appear in the changelog

Commit the generated `.changeset/*.md` file alongside your code changes.

### Step 2: Merge your PR

When your PR is merged to `main`, the **Release** workflow runs automatically. If there are pending changesets, it creates (or updates) a **"Version Packages" PR** that:

- Bumps versions in all `package.json` files (all packages share one version)
- Updates `CHANGELOG.md` in each package
- Consumes (deletes) the pending changeset files

### Step 3: Merge the Version Packages PR

Review the version bump and changelog entries, then merge the Version Packages PR. This triggers the Release workflow again — this time it publishes all 6 packages to npm and creates a git tag `v{version}`.

**Bun note:** this repo uses Bun workspaces. Unlike pnpm, Bun/`changeset publish` does not rewrite `workspace:` protocol ranges into semver before packing. The `release` script therefore runs three guards immediately before `changeset publish`:

1. `resolve-workspace-protocol.mjs` — rewrite `workspace:*` → `^version`
2. `assert-no-workspace-protocol.mjs` — refuse publish if any `workspace:` remain (issue #103 class)
3. `assert-package-entrypoints.mjs` — refuse publish if `main`/`exports`/`bin` paths are missing (CLI bin class)

Do not commit the rewritten `package.json` files from a local dry-run.

Maintainer checklist: [`MAINTAINER_RELEASE_CHECKLIST.md`](../MAINTAINER_RELEASE_CHECKLIST.md).

**Note:** npm never allows republishing the same version. If publish fails with "cannot publish over previously published versions", add a new changeset with a bump and go through the flow again.

**OIDC vs deprecate:** Trusted publishing can publish with provenance. It cannot run `npm deprecate`. Deprecations need an owner login or an Automation token (see [#108](https://github.com/sam247/openredaction/issues/108)).

## Install for users

```bash
npm install openredaction
```

```ts
import { OpenRedaction } from 'openredaction';
```

Or install individual packages:

```bash
npm install @openredaction/core @openredaction/react
```
