/**
 * OpenRedact - Production-ready PII detection and redaction library
 * @packageDocumentation
 */

export { OpenRedact } from './detector';

export type {
  PIIPattern,
  PIIDetection,
  DetectionResult,
  OpenRedactOptions,
  Validator
} from './types';

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
export type { OpenRedactConfig } from './config/ConfigLoader';

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

// Streaming API
export {
  StreamingDetector,
  createStreamingDetector
} from './streaming/StreamingDetector';
export type {
  ChunkResult,
  StreamingOptions
} from './streaming/StreamingDetector';

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
