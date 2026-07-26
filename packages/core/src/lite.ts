/**
 * Lite OpenRedaction — core detection only, no optional subsystems
 *
 * This entry point excludes: learning, NER, optimizer, audit, metrics,
 * RBAC, reports, explain, document, batch, health. Construction is shared
 * with OpenRedaction via createDetectionCore; only subsystem wiring differs.
 *
 * @packageDocumentation
 */

import type { CacheManager } from "./detector/CacheManager";
import {
  createDetectionCore,
  resolveOptions,
} from "./detector/createDetectionCore";
import type { DetectionEngine } from "./detector/DetectionEngine";
import type { PatternManager } from "./detector/PatternManager";
import { restoreRedacted } from "./detector/RedactionUtils";
import type { DetectorOptions } from "./detector/types";
import type {
  DetectionResult,
  IDetector,
  OpenRedactionOptions,
  PIIDetection,
  PIIPattern,
} from "./types";

export interface LiteOptions extends OpenRedactionOptions {
  maxInputSize?: number;
  regexTimeout?: number;
}

export class LiteOpenRedaction implements IDetector {
  options: DetectorOptions;
  private patternManager: PatternManager;
  private cacheManager: CacheManager;
  private detectionEngine: DetectionEngine;

  constructor(options: LiteOptions = {}) {
    this.options = resolveOptions(options);

    const core = createDetectionCore(this.options);

    this.cacheManager = core.cacheManager;
    this.patternManager = core.patternManager;
    this.detectionEngine = core.detectionEngine;
  }

  async detect(text: string): Promise<DetectionResult> {
    return this.detectionEngine.detect(text);
  }

  restore(redactedText: string, redactionMap: Record<string, string>): string {
    return restoreRedacted(redactedText, redactionMap);
  }

  getPatterns(): PIIPattern[] {
    return this.patternManager.getPatterns();
  }

  async scan(text: string): Promise<{
    high: PIIDetection[];
    medium: PIIDetection[];
    low: PIIDetection[];
    total: number;
  }> {
    const result = await this.detect(text);

    return {
      high: result.detections.filter((d) => d.severity === "high"),
      medium: result.detections.filter((d) => d.severity === "medium"),
      low: result.detections.filter((d) => d.severity === "low"),
      total: result.detections.length,
    };
  }

  clearCache(): void {
    this.cacheManager.clear();
  }

  getCacheStats(): { size: number; maxSize: number; enabled: boolean } {
    return this.cacheManager.getStats();
  }
}

export type {
  DetectionResult,
  IDetector,
  OpenRedactionOptions,
  PIIDetection,
  PIIPattern,
  PresetName,
  RedactionMode,
} from "./types";
