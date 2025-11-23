import { PIIPattern } from '../types';
import { LocalLearningStore } from '../learning/LocalLearningStore';

export interface PatternStats {
  type: string;
  totalDetections: number;
  falsePositives: number;
  falseNegatives: number;
  accuracy: number;
  priority: number;
  adjustedPriority: number;
}

export interface OptimizerOptions {
  learningWeight: number; // How much to weight learning data (0-1)
  minSampleSize: number; // Minimum detections before adjusting priority
  maxPriorityAdjustment: number; // Maximum +/- adjustment to priority
}

/**
 * Priority Optimizer - Dynamically adjusts pattern priorities based on learning data
 */
export class PriorityOptimizer {
  private learningStore: LocalLearningStore;
  private options: OptimizerOptions;

  constructor(learningStore: LocalLearningStore, options: Partial<OptimizerOptions> = {}) {
    this.learningStore = learningStore;
    this.options = {
      learningWeight: options.learningWeight ?? 0.3, // 30% weight to learning data
      minSampleSize: options.minSampleSize ?? 10, // Need 10+ detections to adjust
      maxPriorityAdjustment: options.maxPriorityAdjustment ?? 15 // Max ±15 priority points
    };
  }

  /**
   * Optimize pattern priorities based on learning data
   */
  optimizePatterns(patterns: PIIPattern[]): PIIPattern[] {
    // Get learning stats
    const whitelistEntries = this.learningStore.getWhitelistEntries();
    const patternAdjustments = this.learningStore.getAllPatternAdjustments();

    // Calculate false positive rate per pattern type
    const fpCountByType = new Map<string, number>();

    for (const entry of whitelistEntries) {
      // Whitelist entries represent false positives
      const occurrences = entry.occurrences;

      // Try to infer pattern type from contexts
      // This is a heuristic - in a real system we'd track this explicitly
      const inferredType = this.inferPatternType(entry.pattern);

      if (inferredType) {
        fpCountByType.set(inferredType, (fpCountByType.get(inferredType) || 0) + occurrences);
      }
    }

    // Calculate false negative rate per pattern type
    const fnCountByType = new Map<string, number>();

    for (const adjustment of patternAdjustments) {
      fnCountByType.set(adjustment.type, (fnCountByType.get(adjustment.type) || 0) + adjustment.occurrences);
    }

    // Calculate total detections per type (estimated)
    const totalDetectionsByType = new Map<string, number>();
    for (const pattern of patterns) {
      const fpCount = fpCountByType.get(pattern.type) || 0;
      const fnCount = fnCountByType.get(pattern.type) || 0;

      // Estimate total detections (this is approximate)
      // In a real system, we'd track actual detections per pattern
      const estimated = Math.max(fpCount + fnCount + 10, 1);
      totalDetectionsByType.set(pattern.type, estimated);
    }

    // Optimize each pattern's priority
    const optimizedPatterns = patterns.map(pattern => {
      const fpCount = fpCountByType.get(pattern.type) || 0;
      const fnCount = fnCountByType.get(pattern.type) || 0;
      const totalDetections = totalDetectionsByType.get(pattern.type) || 1;

      // Skip optimization if not enough data
      if (totalDetections < this.options.minSampleSize) {
        return pattern;
      }

      // Calculate priority adjustment
      let adjustment = 0;

      // If high false positive rate, decrease priority
      const fpRate = fpCount / totalDetections;
      if (fpRate > 0.1) { // More than 10% FP rate
        adjustment -= fpRate * this.options.maxPriorityAdjustment;
      }

      // If high false negative rate, increase priority
      const fnRate = fnCount / totalDetections;
      if (fnRate > 0.1) { // More than 10% FN rate
        adjustment += fnRate * this.options.maxPriorityAdjustment;
      }

      // Weight the adjustment
      adjustment *= this.options.learningWeight;

      // Clamp adjustment
      adjustment = Math.max(
        -this.options.maxPriorityAdjustment,
        Math.min(this.options.maxPriorityAdjustment, adjustment)
      );

      // Calculate new priority
      const newPriority = Math.max(0, Math.min(100, pattern.priority + adjustment));

      // Return pattern with adjusted priority (if significant change)
      if (Math.abs(adjustment) > 1) {
        return {
          ...pattern,
          priority: Math.round(newPriority)
        };
      }

      return pattern;
    });

    return optimizedPatterns;
  }

  /**
   * Get pattern statistics with learning data
   */
  getPatternStats(patterns: PIIPattern[]): PatternStats[] {
    const whitelistEntries = this.learningStore.getWhitelistEntries();
    const patternAdjustments = this.learningStore.getAllPatternAdjustments();

    // Calculate stats per pattern type
    const fpCountByType = new Map<string, number>();
    for (const entry of whitelistEntries) {
      const inferredType = this.inferPatternType(entry.pattern);
      if (inferredType) {
        fpCountByType.set(inferredType, (fpCountByType.get(inferredType) || 0) + entry.occurrences);
      }
    }

    const fnCountByType = new Map<string, number>();
    for (const adjustment of patternAdjustments) {
      fnCountByType.set(adjustment.type, (fnCountByType.get(adjustment.type) || 0) + adjustment.occurrences);
    }

    // Build stats for each pattern
    const stats: PatternStats[] = patterns.map(pattern => {
      const fpCount = fpCountByType.get(pattern.type) || 0;
      const fnCount = fnCountByType.get(pattern.type) || 0;
      const totalDetections = Math.max(fpCount + fnCount + 10, 1);
      const incorrect = fpCount + fnCount;
      const accuracy = (totalDetections - incorrect) / totalDetections;

      return {
        type: pattern.type,
        totalDetections,
        falsePositives: fpCount,
        falseNegatives: fnCount,
        accuracy,
        priority: pattern.priority,
        adjustedPriority: pattern.priority // Will be updated by optimizePatterns
      };
    });

    return stats;
  }

  /**
   * Infer pattern type from a whitelisted value
   * This is a heuristic - in production we'd track this explicitly
   */
  private inferPatternType(value: string): string | null {
    // Email pattern
    if (/@/.test(value)) return 'EMAIL';

    // Phone pattern
    if (/^\+?\d[\d\s\-()]{7,}$/.test(value)) return 'PHONE';

    // SSN pattern
    if (/^\d{3}-\d{2}-\d{4}$/.test(value)) return 'SSN';

    // Credit card pattern
    if (/^\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/.test(value)) return 'CREDIT_CARD';

    // IP address pattern
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return 'IP_ADDRESS';

    // Name pattern (2-4 capitalized words)
    if (/^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$/.test(value)) return 'NAME';

    // Default: couldn't infer
    return null;
  }

  /**
   * Reset all priority adjustments
   */
  resetPriorities(patterns: PIIPattern[]): PIIPattern[] {
    // This would restore original priorities from a stored baseline
    // For now, just return patterns as-is
    return patterns;
  }

  /**
   * Get optimizer configuration
   */
  getOptions(): OptimizerOptions {
    return { ...this.options };
  }

  /**
   * Update optimizer configuration
   */
  setOptions(options: Partial<OptimizerOptions>): void {
    this.options = {
      ...this.options,
      ...options
    };
  }
}

/**
 * Create a priority optimizer instance
 */
export function createPriorityOptimizer(
  learningStore: LocalLearningStore,
  options?: Partial<OptimizerOptions>
): PriorityOptimizer {
  return new PriorityOptimizer(learningStore, options);
}
