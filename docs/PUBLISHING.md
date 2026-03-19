# Publishing to npm

The package is published as **openredaction** (unscoped). The GitHub Action publishes on every tag `v*.*.*` (e.g. `v1.0.8`).

## One-time setup

### 1. Create an npm account (if needed)

- Sign up at [npmjs.com](https://www.npmjs.com/signup).
### 2. Create an Automation token

- **npm requires 2FA** (or a granular token with "bypass 2FA") to publish. Enable 2FA first: npm → Profile → Account → Two-factor authentication.
- Log in at [npmjs.com](https://www.npmjs.com/).
- Profile (top right) → **Access Tokens** → **Generate New Token** → **Automation** (or **Classic** → “Automation”).
- Copy the token (starts with `npm_`). You won’t see it again.

### 3. Add the token to GitHub

- Repo → **Settings** → **Secrets and variables** → **Actions**.
- **New repository secret**: name = `NPM_TOKEN`, value = the token you copied (no trailing newline).
- Save.

**Token expiry:** npm Automation tokens expire after **90 days**. When publish fails with auth errors, create a new token at npmjs.com and update the `NPM_TOKEN` secret in this repo.

## Releasing a new version

1. Bump version in `packages/core/package.json` (e.g. `1.0.9`).
2. Commit and push to `main`.
3. Create and push a tag:
   ```bash
   git tag -a v1.0.9 -m "Release 1.0.9"
   git push origin v1.0.9
   ```
4. The **Publish to npm** workflow runs and publishes **openredaction@1.0.9** to npm.

**npm package page README:** Comes from `packages/core/README.md` in the published tarball. To refresh npmjs.com text, change that file and publish a new version (npm does not allow in-place README edits).

## Install for users

```bash
npm install openredaction
```

```ts
import { OpenRedaction } from 'openredaction';
```
