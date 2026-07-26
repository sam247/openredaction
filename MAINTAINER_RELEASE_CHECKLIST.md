# Maintainer release checklist

Canonical process for shipping OpenRedaction packages to npm. Prefer this over
ad-hoc memory. Details live in [`docs/PUBLISHING.md`](./docs/PUBLISHING.md).

## Before you merge a feature PR

- [ ] Changeset added (`bunx changeset`) for every user-facing package change
- [ ] CI green on the PR — including **Build** (entrypoint assert) and
      **Consumer smoke** (pack + npm/pnpm/yarn)
- [ ] No `workspace:` ranges introduced outside workspace deps (they are OK in
      repo sources; they must not ship)

## Merge → version

1. Merge the feature PR to `main`
2. Wait for **Release** workflow to open/update **Version Packages**
3. Review version bumps + changelogs
4. Merge Version Packages

Expected bumps (current fixed groups):

- Group A: `openredaction`, `@openredaction/{core,cli,express,react,server}`
- Group B: `@openredaction/{hono,elysia}`

## Publish

1. **Publish** workflow detects `packages/*/package.json` version bumps
2. Approve the `npm-publish` environment when prompted
3. Confirm the job runs `bun run release`, which is:
   - `turbo build`
   - `resolve-workspace-protocol` — Bun does not rewrite `workspace:` on publish
   - `assert-no-workspace-protocol` — refuse to publish if rewrite missed anything
   - `assert-package-entrypoints` — refuse if `main`/`exports`/`bin` files are missing
   - `changeset publish`
4. Confirm GitHub Releases / tags were created per package

## Verification after publish

Pre-publish install/exports/CJS/ESM/`tsc` coverage is already gated by CI
(**Consumer smoke** + **Build** entrypoint assert). Do **not** re-run those
manually unless CI was skipped or you suspect a registry-only failure.

Registry-only checks CI cannot cover:

```bash
# Manifests on the registry (not the packed local tarball)
npm view openredaction@latest dependencies
npm view @openredaction/express@latest dependencies
# Expect semver (^x.y.z), never workspace:*

# CLI from the published tarball (bin paths only matter after publish)
npx --yes @openredaction/cli@latest --help

# Provenance attestation
npm view openredaction@latest dist.attestations
```

If CI was green and the checks above pass, the release is verified.

## Rollback / incident

npm cannot unpublish recent public versions in most cases. Prefer:

1. Ship a patch that fixes the defect
2. `npm deprecate <pkg>@<broken>` with a clear message (needs owner token —
   OIDC publish **cannot** deprecate; see [#108](https://github.com/sam247/openredaction/issues/108))
3. Comment on the reporter issue with the fixed version

## Issue handling

- Packaging/install failures: treat as P0 until a patch is on `latest`
- Open a follow-up for deprecations / docs drift that must not block the patch
- Keep [#108](https://github.com/sam247/openredaction/issues/108) until broken
  `1.1.3` / `1.0.1` versions are deprecated

## Do not

- Commit rewritten `package.json` files after a local `resolve-workspace-protocol` dry-run
- Republish the same version
- Treat “unit tests passed” as a substitute for consumer-smoke / entrypoint asserts
- Deprecate `@openredaction/core@1.1.3` (that version was fine)
