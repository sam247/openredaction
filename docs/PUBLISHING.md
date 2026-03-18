# Publishing to npm

The package is published as **openredaction** (unscoped). The GitHub Action publishes on every tag `v*.*.*` (e.g. `v1.0.7`).

## One-time setup

### 1. Create an npm account (if needed)

- Sign up at [npmjs.com](https://www.npmjs.com/signup).
### 2. Create an Automation token

- Log in at [npmjs.com](https://www.npmjs.com/).
- Profile (top right) → **Access Tokens** → **Generate New Token** → **Automation** (or **Classic** → “Automation”).
- Copy the token (starts with `npm_`). You won’t see it again.

### 3. Add the token to GitHub

- Repo: **sam247/openredaction** → **Settings** → **Secrets and variables** → **Actions**.
- **New repository secret**: name = `NPM_TOKEN`, value = the token you copied.
- Save.

## Releasing a new version

1. Bump version in `packages/core/package.json` (e.g. `1.0.8`).
2. Commit and push to `main`.
3. Create and push a tag:
   ```bash
   git tag -a v1.0.8 -m "Release 1.0.8"
   git push origin v1.0.8
   ```
4. The **Publish to npm** workflow runs and publishes **openredaction@1.0.8** to npm.

## Install for users

```bash
npm install openredaction
```

```ts
import { OpenRedaction } from 'openredaction';
```
