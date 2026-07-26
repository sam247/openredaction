---
"openredaction": patch
"@openredaction/core": patch
"@openredaction/cli": patch
"@openredaction/express": patch
"@openredaction/react": patch
"@openredaction/server": patch
"@openredaction/hono": patch
"@openredaction/elysia": patch
---

Fix published package manifests: rewrite `workspace:*` dependencies to concrete semver ranges before npm publish so consumers can install with npm, pnpm, and yarn.
