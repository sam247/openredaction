#!/usr/bin/env bun
/**
 * Release guard: after `turbo build`, every path declared in a public
 * package.json (`main`, `module`, `types`, `exports`, `bin`) must exist on disk.
 *
 * Why: unit tests never exercise the published file layout. A bundler rename
 * (e.g. emitting `index.cli.cjs` while `bin` still points at `index.cli.js`)
 * ships a tarball that installs cleanly but fails at runtime — as happened
 * with `@openredaction/cli@1.1.4`.
 *
 * Wired into CI (build job) and `bun run release` so broken manifests cannot
 * reach npm.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PACKAGES_DIR = join(import.meta.dir, "..", "packages");

/** @param {unknown} value @param {string[]} out */
function collectPaths(value, out) {
  if (typeof value === "string" && value.startsWith(".")) {
    out.push(value);
    return;
  }

  if (value && typeof value === "object") {
    for (const child of Object.values(value)) {
      collectPaths(child, out);
    }
  }
}

function main() {
  /** @type {string[]} */
  const errors = [];

  for (const dir of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }

    const pkgDir = join(PACKAGES_DIR, dir.name);
    const pkgPath = join(pkgDir, "package.json");
    if (!existsSync(pkgPath)) {
      continue;
    }

    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (pkg.private) {
      continue;
    }

    /** @type {string[]} */
    const paths = [];
    for (const field of ["main", "module", "types"]) {
      if (typeof pkg[field] === "string") {
        paths.push(pkg[field]);
      }
    }
    collectPaths(pkg.exports, paths);
    collectPaths(pkg.bin, paths);

    const unique = [...new Set(paths)];
    for (const rel of unique) {
      const abs = join(pkgDir, rel);
      if (!existsSync(abs)) {
        errors.push(`${pkg.name}: missing ${rel}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("Package entrypoint assert failed:\n");
    for (const line of errors) {
      console.error(`  - ${line}`);
    }
    process.exit(1);
  }

  console.log("OK: all published package entrypoints exist on disk.");
}

main();
