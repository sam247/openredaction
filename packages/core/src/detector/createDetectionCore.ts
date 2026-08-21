/**
 * Shared construction path for OpenRedaction and LiteOpenRedaction.
 */

import { SeverityClassifier } from "../severity/SeverityClassifier.js";
import type { PIIPattern } from "../types";
import { getPreset } from "../utils/presets";
import { CacheManager } from "./CacheManager";
import { DetectionEngine } from "./DetectionEngine";
import { PatternManager } from "./PatternManager";
import { PlaceholderGenerator } from "./PlaceholderGenerator";
import {
  type DetectorOptions,
  type IAuditFacade,
  mergeOptions,
  type OpenRedactionConstructorOptions,
} from "./types";

export const noopAuditFacade: IAuditFacade = {
  checkPermission: () => true,
  logAudit: () => {},
  recordMetrics: () => {},
  getAuditLogger: () => undefined,
  getMetricsCollector: () => undefined,
  getRBACManager: () => undefined,
};

export function resolveOptions(
  options: OpenRedactionConstructorOptions,
): DetectorOptions {
  const presetOptions = options.preset
    ? getPreset(options.preset)
    : ({} as Partial<DetectorOptions>);

  return mergeOptions(options, presetOptions);
}

export interface DetectionCore {
  cacheManager: CacheManager;
  placeholderGenerator: PlaceholderGenerator;
  severityClassifier: SeverityClassifier;
  patternManager: PatternManager;
  detectionEngine: DetectionEngine;
}

export interface DetectionCoreDeps {
  audit?: IAuditFacade;
  /** Hook applied to the pattern list before severity/priority finalization */
  transformPatterns?: (patterns: PIIPattern[]) => PIIPattern[];
}

export function createDetectionCore(
  resolved: DetectorOptions,
  deps: DetectionCoreDeps = {},
): DetectionCore {
  const cacheManager = new CacheManager(resolved);
  const placeholderGenerator = new PlaceholderGenerator(resolved);

  let patterns = PatternManager.buildPatternList(resolved);

  if (deps.transformPatterns) {
    patterns = deps.transformPatterns(patterns);
  }

  const severityClassifier = new SeverityClassifier();
  patterns = severityClassifier.ensureAllSeverity(patterns);
  patterns.sort((a, b) => b.priority - a.priority);

  const patternManager = new PatternManager(resolved, patterns);

  const detectionEngine = new DetectionEngine(
    resolved,
    patternManager,
    placeholderGenerator,
    cacheManager,
    deps.audit ?? noopAuditFacade,
  );

  return {
    cacheManager,
    placeholderGenerator,
    severityClassifier,
    patternManager,
    detectionEngine,
  };
}
