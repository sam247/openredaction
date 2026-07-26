import type { ContextRulesConfig } from "../context/ContextRules.js";
import type { OptimizerOptions } from "../optimizer/PriorityOptimizer.js";
import type {
  AuditLogEntry,
  DetectionResult,
  IAuditLogger,
  IMetricsCollector,
  IRBACManager,
  OpenRedactionOptions,
  Permission,
  PresetName,
  RedactionMode,
} from "../types";
import type { DetectorFeatures, DetectorProfile } from "./features";

/**
 * Audit/metrics/RBAC surface the detection engine depends on.
 * AuditManager implements this; lite builds use a noop facade.
 */
export interface IAuditFacade {
  checkPermission(permission: Permission): boolean;
  logAudit(
    operation: AuditLogEntry["operation"],
    piiCount: number,
    piiTypes: string[],
    textLength: number,
    processingTimeMs: number,
    redactionMode: RedactionMode,
    debug: boolean,
  ): void;
  recordMetrics(
    result: DetectionResult,
    processingTime: number,
    redactionMode: RedactionMode,
    debug: boolean,
  ): void;
  getAuditLogger(): IAuditLogger | undefined;
  getMetricsCollector(): IMetricsCollector | undefined;
  getRBACManager(): IRBACManager | undefined;
}

export interface DetectorOptions {
  includeNames: boolean;
  includeAddresses: boolean;
  includePhones: boolean;
  includeEmails: boolean;
  patterns: string[];
  categories: string[];
  customPatterns: import("../types").PIIPattern[];
  whitelist: string[];
  deterministic: boolean;
  redactionMode: RedactionMode;
  preset?: PresetName;
  enableContextAnalysis: boolean;
  confidenceThreshold: number;
  enableFalsePositiveFilter: boolean;
  falsePositiveThreshold: number;
  enableMultiPass: boolean;
  multiPassCount: number;
  enableCache: boolean;
  cacheSize: number;
  enablePriorityOptimization: boolean;
  optimizerOptions: OptimizerOptions;
  debug: boolean;
  maxInputSize: number;
  regexTimeout: number;
}

export type OpenRedactionConstructorOptions = OpenRedactionOptions & {
  configPath?: string;
  /** Optional-subsystem baseline (default: "standard") */
  profile?: DetectorProfile;
  /** Per-feature overrides applied on top of the profile */
  features?: Partial<DetectorFeatures>;
  learningStorePath?: string;
  optimizerOptions?: Partial<OptimizerOptions>;
  contextRulesConfig?: ContextRulesConfig;
  maxInputSize?: number;
  regexTimeout?: number;
};

export function mergeOptions(
  options: OpenRedactionConstructorOptions,
  presetOptions: Partial<DetectorOptions>,
): DetectorOptions {
  const {
    configPath: _configPath,
    profile: _profile,
    features: _features,
    learningStorePath: _learningStorePath,
    contextRulesConfig: _contextRulesConfig,
    ...rawDetectionOptions
  } = options;

  // Explicit `undefined` values must not clobber defaults (e.g. a caller
  // spreading `whitelist: maybeUndefined` would otherwise break iteration)
  const detectionOptions = Object.fromEntries(
    Object.entries(rawDetectionOptions).filter(
      ([, value]) => value !== undefined,
    ),
  );

  const merged = {
    includeNames: true,
    includeAddresses: true,
    includePhones: true,
    includeEmails: true,
    patterns: [],
    categories: [],
    customPatterns: [],
    whitelist: [],
    deterministic: true,
    redactionMode: "placeholder" as RedactionMode,
    enableContextAnalysis: true,
    confidenceThreshold: 0.5,
    enableFalsePositiveFilter: true,
    falsePositiveThreshold: 0.7,
    enableMultiPass: false,
    multiPassCount: 3,
    enableCache: false,
    cacheSize: 100,
    enablePriorityOptimization: false,
    debug: false,
    maxInputSize: 10 * 1024 * 1024,
    regexTimeout: 100,
    ...presetOptions,
    ...detectionOptions,
  };

  return {
    ...merged,
    optimizerOptions: {
      learningWeight: options.optimizerOptions?.learningWeight ?? 0.3,
      minSampleSize: options.optimizerOptions?.minSampleSize ?? 10,
      maxPriorityAdjustment:
        options.optimizerOptions?.maxPriorityAdjustment ?? 15,
    },
  };
}
