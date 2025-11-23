/**
 * Multi-pass Detection System
 * Processes patterns in priority-based passes for better accuracy
 */

import { PIIPattern, PIIDetection } from '../types';

/**
 * Detection pass configuration
 */
export interface DetectionPass {
  /** Pass name for debugging */
  name: string;
  /** Minimum priority for this pass */
  minPriority: number;
  /** Maximum priority for this pass */
  maxPriority: number;
  /** Pattern types to include (optional filter) */
  includeTypes?: string[];
  /** Pattern types to exclude (optional filter) */
  excludeTypes?: string[];
  /** Description of what this pass detects */
  description: string;
}

/**
 * Default multi-pass configuration
 * Processes patterns in priority order from highest to lowest
 */
export const defaultPasses: DetectionPass[] = [
  {
    name: 'critical-credentials',
    minPriority: 95,
    maxPriority: 100,
    includeTypes: ['API_KEY', 'TOKEN', 'SECRET', 'PASSWORD', 'PRIVATE_KEY', 'AWS', 'GITHUB', 'STRIPE'],
    description: 'Critical credentials and API keys (priority 95-100)'
  },
  {
    name: 'high-confidence',
    minPriority: 85,
    maxPriority: 94,
    description: 'High-confidence patterns with strong validation (priority 85-94)'
  },
  {
    name: 'standard-pii',
    minPriority: 70,
    maxPriority: 84,
    description: 'Standard PII patterns (priority 70-84)'
  },
  {
    name: 'low-priority',
    minPriority: 0,
    maxPriority: 69,
    description: 'Low priority patterns (priority 0-69)'
  }
];

/**
 * Group patterns into passes based on priority
 */
export function groupPatternsByPass(
  patterns: PIIPattern[],
  passes: DetectionPass[] = defaultPasses
): Map<string, PIIPattern[]> {
  const grouped = new Map<string, PIIPattern[]>();

  // Initialize all passes
  for (const pass of passes) {
    grouped.set(pass.name, []);
  }

  // Group patterns into appropriate passes
  for (const pattern of patterns) {
    for (const pass of passes) {
      // Check priority range
      if (pattern.priority < pass.minPriority || pattern.priority > pass.maxPriority) {
        continue;
      }

      // Check include types filter
      if (pass.includeTypes && pass.includeTypes.length > 0) {
        const matchesInclude = pass.includeTypes.some(type =>
          pattern.type.includes(type)
        );
        if (!matchesInclude) continue;
      }

      // Check exclude types filter
      if (pass.excludeTypes && pass.excludeTypes.length > 0) {
        const matchesExclude = pass.excludeTypes.some(type =>
          pattern.type.includes(type)
        );
        if (matchesExclude) continue;
      }

      // Add to this pass
      grouped.get(pass.name)!.push(pattern);
      break; // Pattern assigned, move to next pattern
    }
  }

  // Sort patterns within each pass by priority (highest first)
  for (const [passName, passPatterns] of grouped.entries()) {
    passPatterns.sort((a, b) => b.priority - a.priority);
    grouped.set(passName, passPatterns);
  }

  return grouped;
}

/**
 * Statistics for multi-pass detection
 */
export interface MultiPassStats {
  /** Total passes executed */
  totalPasses: number;
  /** Detections per pass */
  detectionsPerPass: Map<string, number>;
  /** Patterns processed per pass */
  patternsPerPass: Map<string, number>;
  /** Time spent per pass (ms) */
  timePerPass: Map<string, number>;
  /** Total processing time (ms) */
  totalTime: number;
}

/**
 * Check if a range overlaps with existing detections
 */
export function overlapsWithExisting(
  start: number,
  end: number,
  ranges: Array<[number, number]>
): boolean {
  return ranges.some(
    ([existingStart, existingEnd]) =>
      (start >= existingStart && start < existingEnd) ||
      (end > existingStart && end <= existingEnd) ||
      (start <= existingStart && end >= existingEnd)
  );
}

/**
 * Merge detections from multiple passes
 * Earlier passes (higher priority) take precedence for overlapping ranges
 */
export function mergePassDetections(
  passDetections: Map<string, PIIDetection[]>,
  passes: DetectionPass[]
): PIIDetection[] {
  const merged: PIIDetection[] = [];
  const processedRanges: Array<[number, number]> = [];

  // Process passes in order (highest priority first)
  for (const pass of passes) {
    const detections = passDetections.get(pass.name) || [];

    for (const detection of detections) {
      const [start, end] = detection.position;

      // Skip if this range overlaps with a higher-priority detection
      if (overlapsWithExisting(start, end, processedRanges)) {
        continue;
      }

      // Add detection and mark range as processed
      merged.push(detection);
      processedRanges.push([start, end]);
    }
  }

  return merged;
}

/**
 * Create a simple multi-pass configuration for common use cases
 */
export function createSimpleMultiPass(options?: {
  /** Number of passes (2-5, default: 3) */
  numPasses?: number;
  /** Prioritize credentials first */
  prioritizeCredentials?: boolean;
}): DetectionPass[] {
  const numPasses = Math.min(Math.max(options?.numPasses || 3, 2), 5);
  const prioritizeCredentials = options?.prioritizeCredentials ?? true;

  const passes: DetectionPass[] = [];

  // Remaining passes: divide priority range evenly
  const startPriority = prioritizeCredentials ? 0 : 0;
  const endPriority = prioritizeCredentials ? 89 : 100;
  const range = endPriority - startPriority;
  const passesNeeded = prioritizeCredentials ? numPasses - 1 : numPasses;
  const step = Math.floor(range / passesNeeded);

  // Build passes from low to high priority
  const regularPasses: DetectionPass[] = [];
  for (let i = 0; i < passesNeeded; i++) {
    const min = startPriority + (i * step);
    const max = i === passesNeeded - 1 ? endPriority : startPriority + ((i + 1) * step) - 1;

    regularPasses.push({
      name: `pass-${i + 1}`,
      minPriority: min,
      maxPriority: max,
      description: `Priority ${min}-${max}`
    });
  }

  // Add regular passes in reverse order (highest priority first)
  passes.push(...regularPasses.reverse());

  // Add credentials pass first (highest priority)
  if (prioritizeCredentials) {
    passes.unshift({
      name: 'credentials',
      minPriority: 90,
      maxPriority: 100,
      includeTypes: ['API_KEY', 'TOKEN', 'SECRET', 'PASSWORD', 'AWS', 'GITHUB', 'STRIPE', 'JWT'],
      description: 'Credentials and API keys'
    });
  }

  return passes;
}
