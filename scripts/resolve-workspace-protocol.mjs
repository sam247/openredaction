#!/usr/bin/env bun
/**
 * Bun workspaces + `changeset publish` do not rewrite `workspace:` protocol
 * into concrete semver ranges (unlike pnpm). Published tarballs then contain
 * `workspace:*`, which breaks npm / pnpm / yarn consumers.
 *
 * @see https://github.com/oven-sh/bun/issues/24687
 * @see https://github.com/changesets/changesets/issues/1468
 *
 * Run this immediately before `changeset publish` in CI. Mutates package.json
 * files in place — safe on ephemeral CI runners; do not commit the result.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const PACKAGES_DIR = join(ROOT, "packages");

const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

function loadWorkspacePackages() {
  /** @type {Map<string, { dir: string, pkg: Record<string, unknown> }>} */
  const byName = new Map();

  for (const dir of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }

    const pkgPath = join(PACKAGES_DIR, dir.name, "package.json");
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      if (typeof pkg.name === "string" && typeof pkg.version === "string") {
        byName.set(pkg.name, { dir: dir.name, pkg, pkgPath });
      }
    } catch {
      // skip non-package dirs
    }
  }

  return byName;
}

/**
 * @param {string} range
 * @param {string} version
 */
function resolveWorkspaceRange(range, version) {
  if (range === "workspace:*" || range === "workspace:^") {
    return `^${version}`;
  }

  if (range === "workspace:~") {
    return `~${version}`;
  }

  if (range.startsWith("workspace:")) {
    const rest = range.slice("workspace:".length);
    if (rest === version || rest === `^${version}` || rest === `~${version}`) {
      return rest.startsWith("^") || rest.startsWith("~")
        ? rest
        : `^${version}`;
    }
    // workspace:^1.2.3 or workspace:1.2.3 → strip protocol
    return rest;
  }

  return null;
}

function main() {
  const workspace = loadWorkspacePackages();
  let replacements = 0;

  for (const { pkg, pkgPath } of workspace.values()) {
    let changed = false;

    for (const field of DEP_FIELDS) {
      const deps = pkg[field];
      if (!deps || typeof deps !== "object") {
        continue;
      }

      for (const [name, range] of Object.entries(deps)) {
        if (typeof range !== "string" || !range.startsWith("workspace:")) {
          continue;
        }

        const target = workspace.get(name);
        if (!target) {
          throw new Error(
            `${pkg.name}: ${field}.${name} uses ${range} but ${name} is not in this workspace`,
          );
        }

        const resolved = resolveWorkspaceRange(range, target.pkg.version);
        if (!resolved) {
          throw new Error(
            `${pkg.name}: unsupported workspace range ${range} for ${name}`,
          );
        }

        deps[name] = resolved;
        changed = true;
        replacements += 1;
        console.log(`${pkg.name}: ${field}.${name}: ${range} -> ${resolved}`);
      }
    }

    if (changed) {
      writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    }
  }

  console.log(
    `Resolved ${replacements} workspace: dependenc${replacements === 1 ? "y" : "ies"}.`,
  );
}

main();
