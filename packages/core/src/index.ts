/**
 * OpenRedaction - Production-ready PII detection and redaction library
 *
 * Node `http` listeners (`APIServer`, `PrometheusServer`) live under
 * `openredaction/server`, not this entry.
 *
 * @packageDocumentation
 */

export type {
  AuditBackend,
  AuditDatabaseConfig,
  AuditQueryFilter,
  HashedAuditLogEntry,
  IAuditDatabaseAdapter,
  PersistentAuditLoggerOptions,
  RetentionPolicy,
} from "./audit";
// Audit logging
export {
  ConsoleAuditLogger,
  createPersistentAuditLogger,
  InMemoryAuditLogger,
  PersistentAuditLogger,
} from "./audit";
export type {
  BatchOptions,
  BatchResult,
} from "./batch/BatchProcessor";
// Batch processing
export {
  BatchProcessor,
  createBatchProcessor,
} from "./batch/BatchProcessor";
export type { ExportedConfig } from "./config/ConfigExporter";
// Configuration Import/Export (Phase 3)
export {
  ConfigExporter,
  createConfigPreset,
  exportForVersionControl,
} from "./config/ConfigExporter";
export type { OpenRedactionConfig } from "./config/ConfigLoader";
// Config system
export { ConfigLoader } from "./config/ConfigLoader";
export type {
  ContextAnalysis,
  ContextFeatures,
} from "./context/ContextAnalyzer";
// Context analysis system
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
// Context rules engine (Phase 2)
export {
  ContextRulesEngine,
  createContextRulesEngine,
  DEFAULT_DOMAIN_VOCABULARIES,
  DEFAULT_PROXIMITY_RULES,
} from "./context/ContextRules";
export { OpenRedaction } from "./detector";
export type {
  CellMatch,
  ColumnStats,
  CsvDetectionResult,
  CsvProcessorOptions,
  DocumentFormat,
  DocumentMetadata,
  DocumentOptions,
  DocumentResult,
  IDocumentProcessor,
  ImageFormat,
  IOCRProcessor,
  JsonDetectionResult,
  JsonProcessorOptions,
  OCRLanguage,
  OCROptions,
  OCRResult,
  SheetDetectionResult,
  XlsxDetectionResult,
  XlsxProcessorOptions,
} from "./document";
// Document processing (optional - requires peer dependencies)
export {
  CsvProcessor,
  createCsvProcessor,
  createDocumentProcessor,
  createJsonProcessor,
  createOCRProcessor,
  createXlsxProcessor,
  DocumentProcessor,
  JsonProcessor,
  OCRProcessor,
  XlsxProcessor,
} from "./document";
export type { ErrorSuggestion } from "./errors/OpenRedactionError";
// Error handling
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
export type {
  PatternMatchResult,
  TextExplanation,
} from "./explain/ExplainAPI";
// Explain API
export {
  createExplainAPI,
  ExplainAPI,
} from "./explain/ExplainAPI";
export type { FalsePositiveRule } from "./filters/FalsePositiveFilter";
// False positive filtering
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
// Health Check API (Phase 3)
export {
  createHealthChecker,
  HealthChecker,
  healthCheckMiddleware,
} from "./health/HealthCheck";
export type {
  LearningData,
  LearningStats,
  PatternAdjustment,
  WhitelistEntry,
} from "./learning/LocalLearningStore";
// Local learning system
export { LocalLearningStore } from "./learning/LocalLearningStore";
// Metrics collection (in-memory only on this entry; HTTP metrics server → `openredaction/server`)
export { InMemoryMetricsCollector } from "./metrics";
export type {
  HybridMatch,
  NEREntityType,
  NERMatch,
} from "./ml/NERDetector";
// NER detection (Phase 2 - requires compromise.js peer dependency)
export {
  createNERDetector,
  NERDetector,
} from "./ml/NERDetector";
export type {
  DetectionPass,
  MultiPassStats,
} from "./multipass/MultiPassDetector";
// Multi-pass detection
export {
  createSimpleMultiPass,
  defaultPasses,
  groupPatternsByPass,
  mergePassDetections,
} from "./multipass/MultiPassDetector";
export type {
  OptimizerOptions,
  PatternStats,
} from "./optimizer/PriorityOptimizer";
// Priority optimization
export {
  createPriorityOptimizer,
  PriorityOptimizer,
} from "./optimizer/PriorityOptimizer";
export {
  allPatterns,
  contactPatterns,
  financialPatterns,
  getPatternsByCategory,
  governmentPatterns,
  networkPatterns,
  personalPatterns,
} from "./patterns";
// RBAC (Role-Based Access Control)
export {
  ADMIN_ROLE,
  ALL_PERMISSIONS,
  ANALYST_ROLE,
  createCustomRole,
  createRBACManager,
  getPredefinedRole,
  OPERATOR_ROLE,
  RBACManager,
  VIEWER_ROLE,
} from "./rbac";
export type {
  ReportFormat,
  ReportOptions,
  ReportType,
} from "./reports/ReportGenerator";
// Report generation
export {
  createReportGenerator,
  ReportGenerator,
} from "./reports/ReportGenerator";
export type {
  RiskScore,
  SeverityClassification,
  SeverityLevel,
} from "./severity/SeverityClassifier";
// Severity classification (Phase 2)
export {
  calculateRisk,
  createSeverityClassifier,
  DEFAULT_SEVERITY_MAP,
  getSeverity,
  SEVERITY_SCORES,
  SeverityClassifier,
} from "./severity/SeverityClassifier";
export type {
  ChunkResult,
  StreamingOptions,
} from "./streaming/StreamingDetector";
// Streaming API
export {
  createStreamingDetector,
  StreamingDetector,
} from "./streaming/StreamingDetector";
export type {
  TenantConfig,
  TenantQuotas,
  TenantUsage,
} from "./tenancy";
// Multi-tenancy (Phase 3)
export {
  createTenantManager,
  DEFAULT_TIER_QUOTAS,
  TenantManager,
  TenantNotFoundError,
  TenantQuotaExceededError,
  TenantSuspendedError,
} from "./tenancy";
export type {
  AuditLogEntry,
  AuditStats,
  DetectionResult,
  IAuditLogger,
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
export { dequal } from "./utils/dequal";
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
// Safe Regex Utilities (Security)
export {
  compileSafeRegex,
  isUnsafePattern,
  RegexMaxMatchesError,
  RegexTimeoutError,
  safeExec,
  safeExecAll,
  validatePattern,
} from "./utils/safe-regex";
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
export type {
  WebhookConfig,
  WebhookDelivery,
  WebhookDeliveryStatus,
  WebhookEvent,
  WebhookEventType,
  WebhookStats,
} from "./webhooks";
// Webhooks and alerts (Phase 3)
export {
  createWebhookManager,
  verifyWebhookSignature,
  WebhookManager,
} from "./webhooks";
export type {
  DetectTask,
  DocumentTask,
  WorkerPoolConfig,
  WorkerPoolStats,
  WorkerResult,
  WorkerTask,
} from "./workers";
// Worker threads (parallel processing)
export {
  createWorkerPool,
  WorkerPool,
} from "./workers";
