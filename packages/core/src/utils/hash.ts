/**
 * Deterministic hashing utilities for placeholder generation
 */

/**
 * Simple deterministic hash function for generating consistent placeholders
 * Uses FNV-1a hash algorithm for speed and good distribution
 */
export function deterministicHash(str: string): number {
  let hash = 2166136261; // FNV offset basis

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return hash >>> 0; // Convert to unsigned 32-bit integer
}

/**
 * Generate a deterministic identifier for PII values
 * Same value always gets the same ID
 */
export function generateDeterministicId(value: string, type: string): string {
  const hash = deterministicHash(`${type}:${value.toLowerCase()}`);
  return (hash % 10000).toString().padStart(4, '0');
}
