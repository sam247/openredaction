#!/usr/bin/env bun
/**
 * Fail the publish job if any packages/* package.json still contains a
 * `workspace:` protocol in dependency fields. Prevents shipping unusable
 * tarballs when Bun/Changesets skip protocol rewriting.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PACKAGES_DIR = join(import.meta.dir, "..", "packages");
const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

const offenders = [];

for (const dir of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
  if (!dir.isDirectory()) {
    continue;
  }

  const pkgPath = join(PACKAGES_DIR, dir.name, "package.json");
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  } catch {
    continue;
  }

  for (const field of DEP_FIELDS) {
    const deps = pkg[field];
    if (!deps || typeof deps !== "object") {
      continue;
    }

    for (const [name, range] of Object.entries(deps)) {
      if (typeof range === "string" && range.startsWith("workspace:")) {
        offenders.push(`${pkg.name} ${field}.${name}=${range}`);
      }
    }
  }
}

if (offenders.length > 0) {
  console.error(
    "Refusing to publish: workspace: protocol still present in package.json:\n",
  );
  for (const line of offenders) {
    console.error(`  - ${line}`);
  }
  console.error(
    "\nRun `bun run scripts/resolve-workspace-protocol.mjs` before changeset publish.",
  );
  process.exit(1);
}

console.log(
  "OK: no workspace: protocol in packages/*/package.json dependency fields.",
);
