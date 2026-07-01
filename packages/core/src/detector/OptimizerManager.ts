import { createOptimizationDisabledError } from "../errors/OpenRedactionError.js";
import {
  createPriorityOptimizer,
  type OptimizerOptions,
  type PriorityOptimizer,
} from "../optimizer/PriorityOptimizer.js";
import type { PIIPattern } from "../types";
import type { CacheManager } from "./CacheManager";

export class OptimizerManager {
  private priorityOptimizer?: PriorityOptimizer;

  constructor(optimizer: PriorityOptimizer | undefined) {
    this.priorityOptimizer = optimizer;
  }

  static create(
    enableOptimization: boolean,
    learningStore:
      | import("../learning/LocalLearningStore.js").LocalLearningStore
      | undefined,
    optimizerOptions: OptimizerOptions,
  ): OptimizerManager {
    let optimizer: PriorityOptimizer | undefined;

    if (enableOptimization && learningStore) {
      optimizer = createPriorityOptimizer(learningStore, optimizerOptions);
    }

    return new OptimizerManager(optimizer);
  }

  getOptimizer(): PriorityOptimizer | undefined {
    return this.priorityOptimizer;
  }

  optimizePriorities(
    patterns: PIIPattern[],
    cacheManager: CacheManager,
  ): PIIPattern[] {
    if (!this.priorityOptimizer) {
      throw createOptimizationDisabledError();
    }

    const optimized = this.priorityOptimizer.optimizePatterns(patterns);
    optimized.sort((a, b) => b.priority - a.priority);
    cacheManager.clear();

    return optimized;
  }

  getPatternStats(patterns: PIIPattern[]) {
    if (!this.priorityOptimizer) {
      return null;
    }

    return this.priorityOptimizer.getPatternStats(patterns);
  }
}
