/**
 * OpenRedaction - Production-ready PII detection and redaction library
 *
 * This entry contains the detection core. Infrastructure subsystems live on
 * subpath exports:
 *
 * - `@openredaction/core/audit` — audit logger implementations
 * - `@openredaction/core/batch` — batch processing
 * - `@openredaction/core/documents` — document processors (PDF/DOCX/OCR/CSV/JSON/XLSX)
 * - `@openredaction/core/health` — health checks
 * - `@openredaction/core/metrics` — metrics collectors and Prometheus export
 * - `@openredaction/core/rbac` — role-based access control
 * - `@openredaction/core/reports` — report generation
 * - `@openredaction/core/streaming` — streaming detection
 * - `@openredaction/core/tenancy` — multi-tenant management
 * - `@openredaction/core/webhooks` — webhook delivery
 * - `@openredaction/core/workers` — worker-thread pools
 *
 * Node `http` listeners (`APIServer`, `PrometheusServer`) live under
 * `@openredaction/server`, not this package.
 *
 * @packageDocumentation
 */

// Configuration
export type { ExportedConfig } from "./config/ConfigExporter";
export {
  ConfigExporter,
  createConfigPreset,
  exportForVersionControl,
} from "./config/ConfigExporter";
export type { OpenRedactionConfig } from "./config/ConfigLoader";
export { ConfigLoader } from "./config/ConfigLoader";
// Context analysis
export type {
  ContextAnalysis,
  ContextFeatures,
} from "./context/ContextAnalyzer";
export {
  analyzeContextFeatures,
  analyzeFullContext,
  calculateContextConfidence,
  extractContext,
  inferDocumentType,
} from "./context/ContextAnalyzer";
export type {
  ContextRulesConfig,
  DomainVocabulary,
  ProximityRule,
} from "./context/ContextRules";
export {
  ContextRulesEngine,
  createContextRulesEngine,
  DEFAULT_DOMAIN_VOCABULARIES,
  DEFAULT_PROXIMITY_RULES,
} from "./context/ContextRules";
// Detector
export { OpenRedaction } from "./detector";
export type {
  DetectorFeatures,
  DetectorProfile,
} from "./detector/features";
export type {
  IAuditFacade,
  OpenRedactionConstructorOptions,
} from "./detector/types";
// Types referenced by OpenRedaction methods (implementations on subpaths)
export type {
  DocumentFormat,
  DocumentMetadata,
  DocumentOptions,
  DocumentResult,
} from "./document/types";
// Errors
export type { ErrorSuggestion } from "./errors/OpenRedactionError";
export {
  createCacheDisabledError,
  createConfigLoadError,
  createInvalidPatternError,
  createLearningDisabledError,
  createMultiPassDisabledError,
  createOptimizationDisabledError,
  createValidationError,
  OpenRedactionError,
} from "./errors/OpenRedactionError";
// Explain API (returned by OpenRedaction#explain)
export type {
  PatternMatchResult,
  TextExplanation,
} from "./explain/ExplainAPI";
export {
  createExplainAPI,
  ExplainAPI,
} from "./explain/ExplainAPI";
// False positive filtering
export type { FalsePositiveRule } from "./filters/FalsePositiveFilter";
export {
  commonFalsePositives,
  filterFalsePositives,
  isFalsePositive,
} from "./filters/FalsePositiveFilter";
export type {
  HealthCheckOptions,
  HealthCheckResult,
  HealthCheckStatus,
} from "./health/HealthCheck";
// Learning (backs OpenRedaction learning methods)
export type {
  LearningData,
  LearningStats,
  PatternAdjustment,
  WhitelistEntry,
} from "./learning/LocalLearningStore";
export { LocalLearningStore } from "./learning/LocalLearningStore";
// NER (optional compromise peer dependency)
export type {
  HybridMatch,
  NEREntityType,
  NERMatch,
} from "./ml/NERDetector";
export {
  createNERDetector,
  NERDetector,
} from "./ml/NERDetector";
// Multi-pass detection
export type {
  DetectionPass,
  MultiPassStats,
} from "./multipass/MultiPassDetector";
export {
  createSimpleMultiPass,
  defaultPasses,
  groupPatternsByPass,
  mergePassDetections,
} from "./multipass/MultiPassDetector";
// Priority optimization (backs OpenRedaction#getPriorityOptimizer)
export type {
  OptimizerOptions,
  PatternStats,
} from "./optimizer/PriorityOptimizer";
export {
  createPriorityOptimizer,
  PriorityOptimizer,
} from "./optimizer/PriorityOptimizer";
// Patterns
export {
  allPatterns,
  contactPatterns,
  defaultPatterns,
  financialPatterns,
  getPatternsByCategory,
  getRegisteredCategories,
  governmentPatterns,
  networkPatterns,
  type PatternSource,
  personalPatterns,
  registerPatternCategory,
} from "./patterns";
export type {
  ReportFormat,
  ReportOptions,
  ReportType,
} from "./reports/ReportGenerator";
// Severity classification
export type {
  RiskScore,
  SeverityClassification,
  SeverityLevel,
} from "./severity/SeverityClassifier";
export {
  calculateRisk,
  createSeverityClassifier,
  DEFAULT_SEVERITY_MAP,
  getSeverity,
  SEVERITY_SCORES,
  SeverityClassifier,
} from "./severity/SeverityClassifier";
// Core types
export type {
  AuditLogEntry,
  AuditStats,
  DetectionResult,
  IAuditLogger,
  IDetector,
  IMetricsCollector,
  IMetricsExporter,
  IRBACManager,
  OpenRedactionOptions,
  Permission,
  PIIDetection,
  PIIMatch,
  PIIPattern,
  PresetName,
  RedactionMetrics,
  RedactionMode,
  Role,
  RoleName,
  Validator,
} from "./types";
// Utilities
export { dequal } from "./utils/dequal";
// Presets
export {
  ccpaPreset,
  educationPreset,
  financePreset,
  gdprPreset,
  getPreset,
  healthcarePreset,
  healthcareResearchPreset,
  hipaaPreset,
  pciDssPreset,
  soc2Preset,
  transportLogisticsPreset,
} from "./utils/presets";
export type { SafeRegexOptions } from "./utils/safe-regex";
export {
  compileSafeRegex,
  isUnsafePattern,
  RegexMaxMatchesError,
  RegexTimeoutError,
  safeExec,
  safeExecAll,
  validatePattern,
} from "./utils/safe-regex";

// Validators
export {
  validateAustralianTFN,
  validateCanadianSIN,
  validateEmail,
  validateIBAN,
  validateLuhn,
  validateName,
  validateNHS,
  validateNINO,
  validateRoutingNumber,
  validateSortCode,
  validateSSN,
  validateSWIFTBIC,
  validateUKPassport,
} from "./validators";
