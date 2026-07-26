/**
 * Optional-subsystem feature resolution.
 *
 * Profiles set the baseline; per-feature overrides win. Detection-tuning
 * flags (enableCache, enableMultiPass, ...) are NOT features — they belong
 * to OpenRedactionOptions and presets.
 */

export interface DetectorFeatures {
  /** Local learning store (false positives/negatives, whitelist) */
  learning: boolean;
  /** Learning-driven pattern priority optimization */
  priorityOptimization: boolean;
  /** NER via compromise (optional peer dependency) */
  ner: boolean;
  /** Context rules engine */
  contextRules: boolean;
  /** Audit logging */
  auditLog: boolean;
  /** Metrics collection */
  metrics: boolean;
  /** Role-based access control */
  rbac: boolean;
}

export type DetectorProfile = "standard" | "minimal";

const PROFILES: Record<DetectorProfile, DetectorFeatures> = {
  standard: {
    learning: true,
    priorityOptimization: false,
    ner: false,
    contextRules: true,
    auditLog: false,
    metrics: false,
    rbac: false,
  },
  minimal: {
    learning: false,
    priorityOptimization: false,
    ner: false,
    contextRules: false,
    auditLog: false,
    metrics: false,
    rbac: false,
  },
};

export function resolveFeatures(
  profile: DetectorProfile = "standard",
  overrides: Partial<DetectorFeatures> = {},
): DetectorFeatures {
  return { ...PROFILES[profile], ...overrides };
}
