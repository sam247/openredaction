/**
 * OpenRedaction - Production-ready PII detection and redaction library
 * @packageDocumentation
 */

export { OpenRedaction } from './detector';

export type {
  PIIPattern,
  PIIDetection,
  PIIMatch,
  DetectionResult,
  OpenRedactionOptions,
  RedactionMode,
  Validator,
  IAuditLogger,
  AuditLogEntry,
  AuditStats,
  IMetricsCollector,
  IMetricsExporter,
  RedactionMetrics,
  IRBACManager,
  Role,
  Permission,
  RoleName
} from './types';

// Audit logging
// Note: PersistentAuditLogger and database features moved to @openredaction/server
export {
  InMemoryAuditLogger,
  ConsoleAuditLogger
} from './audit';

// Metrics collection
// Note: PrometheusServer and Grafana features moved to @openredaction/server
export {
  InMemoryMetricsCollector
} from './metrics';

// RBAC (Role-Based Access Control)
// Note: RBAC features moved to @openredaction/server for multi-tenant applications

// Document processing (optional - requires peer dependencies)
export {
  DocumentProcessor,
  createDocumentProcessor,
  OCRProcessor,
  createOCRProcessor,
  JsonProcessor,
  createJsonProcessor,
  CsvProcessor,
  createCsvProcessor,
  XlsxProcessor,
  createXlsxProcessor
} from './document';
export type {
  DocumentFormat,
  DocumentOptions,
  DocumentResult,
  DocumentMetadata,
  IDocumentProcessor,
  ImageFormat,
  OCRLanguage,
  OCROptions,
  IOCRProcessor,
  OCRResult,
  JsonProcessorOptions,
  JsonDetectionResult,
  CsvProcessorOptions,
  CsvDetectionResult,
  ColumnStats,
  CellMatch,
  XlsxProcessorOptions,
  XlsxDetectionResult,
  SheetDetectionResult
} from './document';

export {
  allPatterns,
  personalPatterns,
  financialPatterns,
  governmentPatterns,
  contactPatterns,
  networkPatterns,
  getPatternsByCategory
} from './patterns';

export {
  validateLuhn,
  validateIBAN,
  validateNINO,
  validateNHS,
  validateUKPassport,
  validateSSN,
  validateSortCode,
  validateName,
  validateEmail
} from './validators';

export { gdprPreset, hipaaPreset, ccpaPreset, getPreset } from './utils/presets';

// Local learning system
export { LocalLearningStore } from './learning/LocalLearningStore';
export type {
  WhitelistEntry,
  PatternAdjustment,
  LearningStats,
  LearningData
} from './learning/LocalLearningStore';

// Config system
export { ConfigLoader } from './config/ConfigLoader';
export type { OpenRedactionConfig } from './config/ConfigLoader';

// Context analysis system
export {
  extractContext,
  inferDocumentType,
  analyzeContextFeatures,
  calculateContextConfidence,
  analyzeFullContext
} from './context/ContextAnalyzer';
export type {
  ContextAnalysis,
  ContextFeatures
} from './context/ContextAnalyzer';

// Context rules engine (Phase 2)
export {
  ContextRulesEngine,
  createContextRulesEngine,
  DEFAULT_PROXIMITY_RULES,
  DEFAULT_DOMAIN_VOCABULARIES
} from './context/ContextRules';
export type {
  ProximityRule,
  DomainVocabulary,
  ContextRulesConfig
} from './context/ContextRules';

// NER detection (Phase 2 - requires compromise.js peer dependency)
export {
  NERDetector,
  createNERDetector
} from './ml/NERDetector';
export type {
  NEREntityType,
  NERMatch,
  HybridMatch
} from './ml/NERDetector';

// Severity classification (Phase 2)
export {
  SeverityClassifier,
  createSeverityClassifier,
  getSeverity,
  calculateRisk,
  DEFAULT_SEVERITY_MAP,
  SEVERITY_SCORES
} from './severity/SeverityClassifier';
export type {
  SeverityLevel,
  SeverityClassification,
  RiskScore
} from './severity/SeverityClassifier';

// False positive filtering
export {
  isFalsePositive,
  filterFalsePositives,
  commonFalsePositives
} from './filters/FalsePositiveFilter';
export type {
  FalsePositiveRule
} from './filters/FalsePositiveFilter';

// Multi-pass detection
export {
  groupPatternsByPass,
  mergePassDetections,
  createSimpleMultiPass,
  defaultPasses
} from './multipass/MultiPassDetector';
export type {
  DetectionPass,
  MultiPassStats
} from './multipass/MultiPassDetector';

// Priority optimization
export {
  PriorityOptimizer,
  createPriorityOptimizer
} from './optimizer/PriorityOptimizer';
export type {
  PatternStats,
  OptimizerOptions
} from './optimizer/PriorityOptimizer';

// Streaming API
export {
  StreamingDetector,
  createStreamingDetector
} from './streaming/StreamingDetector';
export type {
  ChunkResult,
  StreamingOptions
} from './streaming/StreamingDetector';

// Worker threads (parallel processing)
export {
  WorkerPool,
  createWorkerPool
} from './workers';
export type {
  WorkerTask,
  WorkerResult,
  WorkerPoolConfig,
  WorkerPoolStats,
  DetectTask,
  DocumentTask
} from './workers';

// Batch processing
export {
  BatchProcessor,
  createBatchProcessor
} from './batch/BatchProcessor';
export type {
  BatchOptions,
  BatchResult
} from './batch/BatchProcessor';

// Explain API
export {
  ExplainAPI,
  createExplainAPI
} from './explain/ExplainAPI';
export type {
  PatternMatchResult,
  TextExplanation
} from './explain/ExplainAPI';

// Report generation
export {
  ReportGenerator,
  createReportGenerator
} from './reports/ReportGenerator';
export type {
  ReportOptions,
  ReportFormat,
  ReportType
} from './reports/ReportGenerator';

// Express integration
export {
  openredactionMiddleware,
  detectPII,
  generateReport
} from './integrations/express';
export type {
  OpenRedactionMiddlewareOptions,
  OpenRedactionRequest
} from './integrations/express';

// React integration
export {
  useOpenRedaction,
  usePIIDetector,
  useFormFieldValidator,
  useBatchDetector,
  useAutoRedact
} from './integrations/react';

// Error handling
export {
  OpenRedactionError,
  createInvalidPatternError,
  createValidationError,
  createHighMemoryError,
  createConfigLoadError,
  createLearningDisabledError,
  createOptimizationDisabledError,
  createMultiPassDisabledError,
  createCacheDisabledError
} from './errors/OpenRedactionError';
export type {
  ErrorSuggestion
} from './errors/OpenRedactionError';

// Multi-tenancy (Phase 3)
// Note: Multi-tenancy features moved to @openredaction/server

// Webhooks and alerts (Phase 3)
// Note: Webhook features moved to @openredaction/server

// REST API Server (Phase 3)
// Note: APIServer moved to @openredaction/server
// Library users should build their own API routes using the core OpenRedaction class

// Configuration Import/Export (Phase 3)
export {
  ConfigExporter,
  createConfigPreset,
  exportForVersionControl
} from './config/ConfigExporter';
export type {
  ExportedConfig
} from './config/ConfigExporter';

// Health Check API (Phase 3)
export {
  HealthChecker,
  createHealthChecker,
  healthCheckMiddleware
} from './health/HealthCheck';
export type {
  HealthCheckResult,
  HealthCheckStatus,
  HealthCheckOptions
} from './health/HealthCheck';

// Safe Regex Utilities (Security)
export {
  safeExec,
  safeExecAll,
  validatePattern,
  isUnsafePattern,
  compileSafeRegex,
  RegexTimeoutError,
  RegexMaxMatchesError
} from './utils/safe-regex';
export type {
  SafeRegexOptions
} from './utils/safe-regex';
