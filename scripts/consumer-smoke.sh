#!/usr/bin/env bash
# Release guard: pack local packages into clean temp projects and verify that
# a first-time consumer can install and use openredaction.
#
# Why: monorepo CI can pass while published tarballs are unusable
# (workspace: leaks, broken exports, missing types, CJS/ESM mismatches).
# This script is the automated form of "mkdir /tmp/app && npm/pnpm/yarn add …".
#
# Checks per package manager (npm, pnpm, yarn):
#   - install from packed .tgz succeeds
#   - CJS require + ESM import work
#   - minimal detect() produces a redaction
#   - TypeScript compiles a tiny consumer
#
# Mutates packages/*/package.json via resolve-workspace-protocol; restores
# them from a backup taken at start (preserves uncommitted local edits).
# Wired into CI as the "Consumer smoke" job.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "consumer-smoke requires Node >= 20 (got $(node -v))" >&2
  exit 1
fi

PKG_BACKUP="$(mktemp -d)"
for dir in "$ROOT"/packages/*/; do
  base="$(basename "$dir")"
  cp "$dir/package.json" "$PKG_BACKUP/$base.json"
done

cleanup() {
  for dir in "$ROOT"/packages/*/; do
    base="$(basename "$dir")"
    if [ -f "$PKG_BACKUP/$base.json" ]; then
      cp "$PKG_BACKUP/$base.json" "$dir/package.json"
    fi
  done
  rm -rf "$PKG_BACKUP"
}
trap cleanup EXIT

echo "==> build packages"
bunx turbo run build --filter=./packages/*

echo "==> resolve workspace: protocol for packing"
bun run scripts/resolve-workspace-protocol.mjs
bun run scripts/assert-no-workspace-protocol.mjs
bun run scripts/assert-package-entrypoints.mjs

STAGING="$(mktemp -d)"
SMOKE_ROOT="$(mktemp -d)"
echo "staging=$STAGING"
echo "smoke=$SMOKE_ROOT"

echo "==> pack"
(
  cd "$STAGING"
  for dir in core express react server cli hono elysia compat; do
    npm pack "$ROOT/packages/$dir" --silent
  done
)

install_from_packs() {
  local mgr="$1"
  local dir="$SMOKE_ROOT/$mgr"
  mkdir -p "$dir"
  cd "$dir"

  # Pin every published package to the local tarball. After a Version Packages
  # bump, resolved deps are ^X.Y.Z which are not on the registry yet — pnpm/yarn
  # would otherwise fetch from npm and fail (npm's multi-tgz install is more
  # forgiving). file: deps keep the smoke pre-publish accurate.
  local core_tgz express_tgz react_tgz server_tgz umbrella_tgz
  core_tgz="$(echo "$STAGING"/openredaction-core-*.tgz)"
  express_tgz="$(echo "$STAGING"/openredaction-express-*.tgz)"
  react_tgz="$(echo "$STAGING"/openredaction-react-*.tgz)"
  server_tgz="$(echo "$STAGING"/openredaction-server-*.tgz)"
  umbrella_tgz="$(echo "$STAGING"/openredaction-1.*.tgz)"

  # Override nested deps so pnpm does not pull registry core without subpaths.
  cat > package.json <<EOF
{
  "name": "openredaction-consumer-smoke",
  "private": true,
  "type": "commonjs",
  "dependencies": {
    "@openredaction/core": "file:${core_tgz}",
    "@openredaction/express": "file:${express_tgz}",
    "@openredaction/react": "file:${react_tgz}",
    "@openredaction/server": "file:${server_tgz}",
    "openredaction": "file:${umbrella_tgz}"
  },
  "overrides": {
    "@openredaction/core": "file:${core_tgz}",
    "@openredaction/express": "file:${express_tgz}",
    "@openredaction/react": "file:${react_tgz}",
    "@openredaction/server": "file:${server_tgz}"
  },
  "pnpm": {
    "overrides": {
      "@openredaction/core": "file:${core_tgz}",
      "@openredaction/express": "file:${express_tgz}",
      "@openredaction/react": "file:${react_tgz}",
      "@openredaction/server": "file:${server_tgz}"
    }
  },
  "resolutions": {
    "@openredaction/core": "file:${core_tgz}",
    "@openredaction/express": "file:${express_tgz}",
    "@openredaction/react": "file:${react_tgz}",
    "@openredaction/server": "file:${server_tgz}"
  }
}
EOF

  case "$mgr" in
    npm)
      npm install
      ;;
    pnpm)
      # Hoist so openredaction's nested @openredaction/core resolves to the
      # local file: tarball (with subpath exports), not a registry copy.
      pnpm install --node-linker=hoisted
      ;;
    yarn)
      yarn install
      ;;
    *)
      echo "unknown manager: $mgr" >&2
      exit 1
      ;;
  esac
}

write_fixtures() {
  cat > cjs-detect.cjs <<'EOF'
const { OpenRedaction } = require("openredaction");

(async () => {
  const redactor = new OpenRedaction();
  // Avoid example.com — filtered as a common false-positive domain.
  const { redacted, detections } = await redactor.detect(
    "email me at smoke@gmail.com",
  );
  const text = String(redacted);
  const ok =
    text.includes("[EMAIL") ||
    text.includes("***") ||
    (Array.isArray(detections) && detections.length > 0);
  if (!ok) {
    console.error("CJS detect produced no redaction/detections", {
      redacted,
      detections,
    });
    process.exit(1);
  }
  console.log("CJS detect ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
EOF

  cat > esm-detect.mjs <<'EOF'
import { OpenRedaction } from "openredaction";

const redactor = new OpenRedaction();
const { redacted, detections } = await redactor.detect(
  "email me at smoke@gmail.com",
);
const text = String(redacted);
const ok =
  text.includes("[EMAIL") ||
  text.includes("***") ||
  (Array.isArray(detections) && detections.length > 0);
if (!ok) {
  console.error("ESM detect produced no redaction/detections", {
    redacted,
    detections,
  });
  process.exit(1);
}
console.log("ESM detect ok");
EOF

  cat > index.ts <<'EOF'
import { OpenRedaction } from "openredaction";

async function main() {
  const redactor = new OpenRedaction();
  const { redacted } = await redactor.detect("email me at smoke@gmail.com");
  console.log(redacted);
}

void main();
EOF

  cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["index.ts"]
}
EOF
}

run_checks() {
  write_fixtures
  node cjs-detect.cjs
  node esm-detect.mjs
  # Avoid mutating the consumer lockfile across managers; fetch tsc ephemerally.
  npx --yes -p typescript tsc -p .
  node dist/index.js >/dev/null
  echo "tsc ok"
}

for mgr in npm pnpm yarn; do
  if ! command -v "$mgr" >/dev/null 2>&1; then
    echo "skip $mgr (not installed)"
    continue
  fi
  echo "==> smoke with $mgr"
  install_from_packs "$mgr"
  cd "$SMOKE_ROOT/$mgr"
  run_checks
done

echo "OK: consumer smoke passed"
