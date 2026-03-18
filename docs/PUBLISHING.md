# Publishing to npm

The package is published as **@sam247/openredaction** (scoped under your npm user so you own it). The GitHub Action publishes on every tag `v*.*.*` (e.g. `v1.0.7`).

## One-time setup

### 1. Create an npm account (if needed)

- Sign up at [npmjs.com](https://www.npmjs.com/signup).
- Use the same username as your scope (e.g. **sam247** for `@sam247/openredaction`).

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
4. The **Publish to npm** workflow runs and publishes `@sam247/openredaction@1.0.8` to npm.

## Install for users

```bash
npm install @sam247/openredaction
```

```ts
import { OpenRedaction } from '@sam247/openredaction';
```
