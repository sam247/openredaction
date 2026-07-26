import type { PIIPattern } from "../types";

export type PatternSource = () => PIIPattern[];

interface CategoryEntry {
  name: string;
  source: PatternSource;
}

const registry = new Map<string, CategoryEntry>();

/**
 * Register a pattern category with optional lookup aliases.
 * Later registrations under the same name or alias override earlier ones.
 */
export function registerPatternCategory(
  name: string,
  source: PatternSource,
  aliases: readonly string[] = [],
): void {
  const entry: CategoryEntry = { name, source };

  registry.set(name, entry);

  for (const alias of aliases) {
    registry.set(alias, entry);
  }
}

export function getPatternsByCategory(category: string): PIIPattern[] {
  return registry.get(category)?.source() ?? [];
}

export function getRegisteredCategories(): string[] {
  return [...new Set([...registry.values()].map((entry) => entry.name))];
}
