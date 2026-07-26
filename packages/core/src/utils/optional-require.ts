import { createRequire } from "node:module";

const optionalRequire = createRequire(import.meta.url);

/**
 * Synchronously load an optional peer dependency.
 * Returns undefined when the module is not installed, so callers can lazily
 * probe without forcing the dependency into every consumer's tree.
 */
export function loadOptionalModule<T>(specifier: string): T | undefined {
  try {
    return optionalRequire(specifier) as T;
  } catch {
    return undefined;
  }
}

/** Check whether a module resolves without executing it. */
export function isModuleAvailable(specifier: string): boolean {
  try {
    optionalRequire.resolve(specifier);
    return true;
  } catch {
    return false;
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
