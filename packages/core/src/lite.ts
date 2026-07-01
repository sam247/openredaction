/**
 * Lite OpenRedaction — core detection only, no optional subsystems
 *
 * This entry point excludes: learning, NER, optimizer, audit, metrics,
 * RBAC, multipass, reports, explain, document, batch, health.
 *
 * @packageDocumentation
 */

import { CacheManager } from "./detector/CacheManager";
import { DetectionEngine } from "./detector/DetectionEngine";
import { PatternManager } from "./detector/PatternManager";
import { PlaceholderGenerator } from "./detector/PlaceholderGenerator";
import { restoreRedacted } from "./detector/RedactionUtils";
import {
  type DetectorOptions,
  mergeOptions,
  type OpenRedactionConstructorOptions,
} from "./detector/types";
import { SeverityClassifier } from "./severity/SeverityClassifier.js";
import type {
  DetectionResult,
  OpenRedactionOptions,
  PIIDetection,
  PIIPattern,
} from "./types";
import { getPreset } from "./utils/presets";

export interface LiteOptions extends OpenRedactionOptions {
  maxInputSize?: number;
  regexTimeout?: number;
}

export class LiteOpenRedaction {
  options: DetectorOptions;
  private patternManager: PatternManager;
  private placeholderGenerator: PlaceholderGenerator;
  private cacheManager: CacheManager;
  private detectionEngine: DetectionEngine;
  private severityClassifier: SeverityClassifier;

  constructor(options: LiteOptions = {}) {
    const constructorOptions: OpenRedactionConstructorOptions = {
      ...options,
      enableLearning: false,
      enablePriorityOptimization: false,
      enableNER: false,
      enableContextRules: false,
      enableAuditLog: false,
      enableMetrics: false,
      enableRBAC: false,
    };

    const presetOptions = options.preset
      ? getPreset(options.preset)
      : ({} as Partial<DetectorOptions>);

    this.options = mergeOptions(constructorOptions, presetOptions);

    this.cacheManager = new CacheManager(this.options);
    this.placeholderGenerator = new PlaceholderGenerator(this.options);

    let patterns = PatternManager.buildPatternList(this.options);

    this.severityClassifier = new SeverityClassifier();
    patterns = this.severityClassifier.ensureAllSeverity(patterns);
    patterns.sort((a, b) => b.priority - a.priority);

    this.patternManager = new PatternManager(this.options, patterns);

    this.detectionEngine = new DetectionEngine(
      this.options,
      this.patternManager,
      this.placeholderGenerator,
      this.cacheManager,
      {
        checkPermission: () => true,
        logAudit: () => {},
        recordMetrics: () => {},
        getAuditLogger: () => undefined,
        getMetricsCollector: () => undefined,
        getRBACManager: () => undefined,
      },
    );
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
  OpenRedactionOptions,
  PIIDetection,
  PIIPattern,
  PresetName,
  RedactionMode,
} from "./types";
