type RequireLike = {
  (specifier: string): unknown;
  resolve(specifier: string): string;
};

type NodeModuleBuiltin = {
  createRequire: (filename: string | URL) => RequireLike;
};

type NodeProcess = {
  versions?: { node?: string };
  getBuiltinModule?: (id: string) => NodeModuleBuiltin;
};

let cachedRequire: RequireLike | undefined | false;

/**
 * Resolve a Node require function without a static `node:module` import.
 * Browser bundlers (e.g. playground esbuild --platform=browser) must not see
 * that builtin at module top-level or the build fails.
 */
function getOptionalRequire(): RequireLike | undefined {
  if (cachedRequire === false) {
    return undefined;
  }

  if (cachedRequire) {
    return cachedRequire;
  }

  const processRef = (globalThis as { process?: NodeProcess }).process;

  if (!processRef?.versions?.node) {
    cachedRequire = false;
    return undefined;
  }

  try {
    if (typeof processRef.getBuiltinModule === "function") {
      cachedRequire = processRef
        .getBuiltinModule("module")
        .createRequire(import.meta.url);
      return cachedRequire;
    }
  } catch {
    // fall through
  }

  try {
    const metaRequire = (import.meta as ImportMeta & { require?: RequireLike })
      .require;

    if (typeof metaRequire === "function") {
      cachedRequire = metaRequire;
      return cachedRequire;
    }
  } catch {
    // fall through
  }

  try {
    const globalRequire = (globalThis as { require?: RequireLike }).require;

    if (typeof globalRequire === "function") {
      const nodeModule = globalRequire("node:module") as NodeModuleBuiltin;

      cachedRequire = nodeModule.createRequire
        ? nodeModule.createRequire(import.meta.url)
        : globalRequire;
      return cachedRequire;
    }
  } catch {
    // fall through
  }

  cachedRequire = false;
  return undefined;
}

/**
 * Synchronously load an optional peer dependency.
 * Returns undefined when the module is not installed, so callers can lazily
 * probe without forcing the dependency into every consumer's tree.
 */
export function loadOptionalModule<T>(specifier: string): T | undefined {
  const optionalRequire = getOptionalRequire();

  if (!optionalRequire) {
    return undefined;
  }

  try {
    return optionalRequire(specifier) as T;
  } catch {
    return undefined;
  }
}

/** Check whether a module resolves without executing it. */
export function isModuleAvailable(specifier: string): boolean {
  const optionalRequire = getOptionalRequire();

  if (!optionalRequire) {
    return false;
  }

  try {
    optionalRequire.resolve(specifier);
    return true;
  } catch {
    return false;
  }
}

export { errorMessage } from "./errors";
