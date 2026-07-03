import { createLearningDisabledError } from "../errors/OpenRedactionError.js";
import { LocalLearningStore } from "../learning/LocalLearningStore.js";
import type { PIIDetection } from "../types";
import type { DetectorOptions } from "./types";

export class LearningManager {
  private learningStore?: LocalLearningStore;

  constructor(
    private options: DetectorOptions,
    enableLearning: boolean,
    learningStorePath?: string,
  ) {
    if (enableLearning) {
      const path = learningStorePath || ".openredaction/learnings.json";
      this.learningStore = new LocalLearningStore(path, {
        autoSave: true,
        confidenceThreshold: 0.85,
      });

      const learnedWhitelist = this.learningStore.getWhitelist();
      this.options.whitelist = [...this.options.whitelist, ...learnedWhitelist];
    }
  }

  getStore(): LocalLearningStore | undefined {
    return this.learningStore;
  }

  recordFalsePositive(detection: PIIDetection, context?: string): void {
    if (!this.learningStore) {
      throw createLearningDisabledError();
    }

    const ctx = context || "";
    this.learningStore.recordFalsePositive(
      detection.value,
      detection.type,
      ctx,
    );

    if (this.learningStore.getConfidence(detection.value) >= 0.85) {
      this.options.whitelist.push(detection.value);
    }
  }

  recordFalseNegative(
    text: string,
    expectedType: string,
    context?: string,
  ): void {
    if (!this.learningStore) {
      throw createLearningDisabledError();
    }

    const ctx = context || "";
    this.learningStore.recordFalseNegative(text, expectedType, ctx);
  }

  recordCorrectDetection(): void {
    if (!this.learningStore) {
      return;
    }

    this.learningStore.recordCorrectDetection();
  }

  getStats() {
    if (!this.learningStore) {
      return null;
    }

    return this.learningStore.getStats();
  }

  getLearnedWhitelist() {
    if (!this.learningStore) {
      return [];
    }

    return this.learningStore.getWhitelistEntries();
  }

  getPatternAdjustments() {
    if (!this.learningStore) {
      return [];
    }

    return this.learningStore.getPatternAdjustments();
  }

  exportLearnings(options?: {
    includeContexts?: boolean;
    minConfidence?: number;
  }) {
    if (!this.learningStore) {
      return null;
    }

    return this.learningStore.exportData(options);
  }

  importLearnings(
    data: import("../learning/LocalLearningStore.js").LearningData,
    merge: boolean = true,
  ): void {
    if (!this.learningStore) {
      throw createLearningDisabledError();
    }

    this.learningStore.importData(data, merge);

    const learnedWhitelist = this.learningStore.getWhitelist();
    this.options.whitelist = [
      ...new Set([...this.options.whitelist, ...learnedWhitelist]),
    ];
  }

  addToWhitelist(pattern: string, confidence: number = 0.9): void {
    if (!this.learningStore) {
      this.options.whitelist.push(pattern);
      return;
    }

    this.learningStore.addToWhitelist(pattern, confidence);
    this.options.whitelist.push(pattern);
  }

  removeFromWhitelist(pattern: string): void {
    if (this.learningStore) {
      this.learningStore.removeFromWhitelist(pattern);
    }

    this.options.whitelist = this.options.whitelist.filter(
      (w) => w !== pattern,
    );
  }
}
