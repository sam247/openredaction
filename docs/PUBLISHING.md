# Publishing to npm

Packages are published to npm with [Changesets](https://github.com/changesets/changesets) and **GitHub OIDC Trusted Publishing**. There is no `NPM_TOKEN` (or any long-lived npm secret) in this repository.

Published packages:

| Package | Notes |
| --- | --- |
| `@openredaction/core` | Shared core |
| `@openredaction/cli` | CLI |
| `@openredaction/react` | React |
| `@openredaction/server` | Server helpers |
| `@openredaction/express` | Express middleware |
| `openredaction` | Umbrella / compat (`packages/compat`) |
| `@openredaction/hono` | Hono adapter |
| `@openredaction/elysia` | Elysia adapter |

Versioning uses two Changesets **fixed** groups (see `.changeset/config.json`):

1. Core group — `openredaction`, `@openredaction/{core,cli,react,server,express}` share one version
2. Adapters — `@openredaction/{hono,elysia}` share one version

`openredaction-site` is private and never published.

## How publishing works

Two workflows on `main`:

| Workflow | Role |
| --- | --- |
| [`.github/workflows/release.yml`](../.github/workflows/release.yml) | Opens / updates the **Version Packages** PR from pending changesets |
| [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) | Publishes to npm after a real version bump (or manual dispatch) |

Auth is **OIDC Trusted Publishing** (`id-token: write`). npm issues a short-lived token for the workflow; provenance (SLSA) attestations are attached automatically.

### `npm-publish` environment

The publish job uses the GitHub Environment **`npm-publish`**, which:

- Restricts deploys to the `main` branch
- Requires a required reviewer (repo owner) before the job runs

Routine pushes to `main` do **not** request approval. A lightweight `decide` job runs first and only continues to the publish job when:

- `packages/*/package.json` versions changed in the push (typical Version Packages merge), or
- someone ran **Publish → workflow_dispatch** with a reason

### Approval flow

1. Merge a feature PR that includes a changeset
2. Merge the **Version Packages** PR (`chore: version packages`)
3. Publish workflow detects version bumps → publish job waits on **`npm-publish`**
4. Approve the pending environment deployment in GitHub Actions
5. Packages publish via OIDC with provenance

Do **not** re-add an `NPM_TOKEN` Actions secret. Trusted Publishing is the only supported path.

## One-time setup (already done for existing packages)

For each package on npm:

1. Package exists on the registry (see [Adding a new package](#adding-a-new-package) if it does not)
2. npm → package → **Settings** → **Trusted Publisher** → GitHub Actions:
   - Repository: `sam247/openredaction`
   - Workflow: `publish.yml`
   - Environment: `npm-publish`
3. GitHub → **Settings** → **Environments** → `npm-publish` with required reviewers and `main` only

Confirm provenance after a publish:

```bash
npm view @openredaction/core@<version> dist.attestations
```

You should see a provenance attestation (`predicateType` includes `slsa.dev/provenance`).

## Releasing a new version

### Step 1: Add a changeset to your PR

```bash
bunx changeset
```

1. Select affected packages  
2. Choose bump type — patch, minor, or major  
3. Write a changelog summary  

Commit the generated `.changeset/*.md` with your code.

### Step 2: Merge your PR

On merge to `main`, the **Release** workflow creates or updates a **Version Packages** PR that bumps `package.json` versions, updates changelogs, and removes consumed changesets.

Version commits are created **without** `[skip ci]` so CI and `publish.yml` can run after that PR merges.

### Step 3: Merge the Version Packages PR

Review bumps and changelogs, then merge. That triggers **Publish**, which waits for **`npm-publish`** approval, then publishes changed packages and creates git tags.

**Note:** npm never allows republishing the same version. If publish fails with “cannot publish over previously published versions”, add a new changeset and go through the flow again (do not force-republish).

### Manual publish

**Actions → Publish → Run workflow**, provide a reason. Still requires `npm-publish` approval. Use only for recovery / deliberate OIDC checks — prefer the Version Packages path for normal releases.

## Adding a new package

Trusted Publisher can only be attached to a package that **already exists** on npm. For a brand-new scoped package:

1. **Bootstrap once** from a trusted machine (owner/maintainer with npm 2FA), publishing the first version (e.g. `1.0.0`) so the package exists on the registry
2. Add that package to Changesets (`.changeset/config.json` fixed/linked groups as appropriate) and the monorepo build/release scripts
3. Configure **Trusted Publisher** on npm for `sam247/openredaction` → `publish.yml` → environment `npm-publish`
4. Subsequent releases go through Changesets + the GitHub approval flow only — no token

Until Trusted Publisher is configured, CI cannot publish that package via OIDC.

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
