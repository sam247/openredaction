/**
 * Core TypeScript types for OpenRedaction
 *
 * Defines the type system for PII detection, redaction, and configuration.
 * All types are exported for use in consuming applications.
 *
 * @packageDocumentation
 */

/**
 * PII pattern definition for detection
 *
 * Defines a pattern for detecting a specific type of PII. Each pattern includes
 * a regex for matching, priority for ordering, optional validator for accuracy,
 * and severity classification.
 *
 * @example Custom employee ID pattern
 * ```typescript
 * const employeePattern: PIIPattern = {
 *   type: 'EMPLOYEE_ID',
 *   regex: /EMP-\d{6}/g,
 *   priority: 10,
 *   placeholder: '[EMPLOYEE_ID]',
 *   severity: 'high',
 *   description: 'Internal employee ID number',
 *   validator: (match) => match.startsWith('EMP-')
 * };
 * ```
 */
export interface PIIPattern {
  /** Pattern type identifier (e.g., "EMAIL", "PHONE_UK_MOBILE") */
  type: string;
  /** Regular expression for matching */
  regex: RegExp;
  /** Priority for detection order (higher = checked first) */
  priority: number;
  /** Optional validator function for false positive reduction */
  validator?: (match: string, context: string) => boolean;
  /** Placeholder template (e.g., "[EMAIL_{n}]") */
  placeholder: string;
  /** Optional description */
  description?: string;
  /** Severity level */
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Detected PII instance with metadata
 *
 * Represents a single piece of PII found in text, including its type,
 * position, severity, and confidence score.
 *
 * @example Working with detections
 * ```typescript
 * const result = detector.detect('Email: john@example.com');
 * const detection: PIIDetection = result.detections[0];
 *
 * console.log(detection.type);        // 'EMAIL_ADDRESS'
 * console.log(detection.value);       // 'john@example.com'
 * console.log(detection.placeholder); // '[EMAIL_1]'
 * console.log(detection.position);    // [7, 24]
 * console.log(detection.severity);    // 'medium'
 * console.log(detection.confidence);  // 0.95
 * ```
 */
export interface PIIDetection {
  /** Type of PII detected */
  type: string;
  /** Original detected value */
  value: string;
  /** Placeholder used for redaction */
  placeholder: string;
  /** Position in text [start, end] */
  position: [number, number];
  /** Severity level */
  severity: 'critical' | 'high' | 'medium' | 'low';
  /** Confidence score (0-1) based on context analysis */
  confidence?: number;
}

/**
 * PII match (used internally for processing)
 */
export interface PIIMatch {
  /** Type of PII */
  type: string;
  /** Matched value */
  value: string;
  /** Start position */
  start: number;
  /** End position */
  end: number;
  /** Confidence score (0-1) */
  confidence: number;
  /** Context around match */
  context: {
    before: string;
    after: string;
  };
}

/**
 * Complete PII detection result
 *
 * Contains the original text, redacted version, all detections, and a
 * redaction map for reversing redactions. Returned by detect() method.
 *
 * @example Using detection results
 * ```typescript
 * const result = detector.detect('Contact: john@example.com, 555-1234');
 *
 * console.log(result.original);   // 'Contact: john@example.com, 555-1234'
 * console.log(result.redacted);   // 'Contact: [EMAIL_1], [PHONE_1]'
 * console.log(result.detections.length); // 2
 *
 * // Reverse redaction
 * let text = result.redacted;
 * for (const [placeholder, value] of Object.entries(result.redactionMap)) {
 *   text = text.replace(placeholder, value);
 * }
 * console.log(text === result.original); // true
 * ```
 *
 * @example Checking for PII
 * ```typescript
 * const result = detector.detect(userInput);
 *
 * if (result.stats && result.stats.piiCount > 0) {
 *   console.log(`Found ${result.stats.piiCount} PII instances`);
 *   console.log(`Processed in ${result.stats.processingTime}ms`);
 * }
 * ```
 */
export interface DetectionResult {
  /** Original text */
  original: string;
  /** Redacted text */
  redacted: string;
  /** Array of detections */
  detections: PIIDetection[];
  /** Map of placeholders to original values for restoration */
  redactionMap: Record<string, string>;
  /** Statistics */
  stats?: {
    /** Processing time in milliseconds */
    processingTime?: number;
    /** Total PII count */
    piiCount: number;
  };
}

/**
 * Redaction mode - controls how PII is replaced in text
 *
 * Different modes provide different levels of obfuscation and readability:
 * - `placeholder`: Replaces with labeled placeholders like [EMAIL_1]
 * - `mask-middle`: Partially masks, keeping context (e.g., j***@example.com)
 * - `mask-all`: Completely masks with asterisks (***************)
 * - `format-preserving`: Maintains structure (e.g., XXX-XX-XXXX for SSN)
 * - `token-replace`: Replaces with realistic fake data
 *
 * @example Different redaction modes
 * ```typescript
 * const text = 'Email: john@example.com';
 *
 * // placeholder mode (default)
 * const d1 = new OpenRedaction({ redactionMode: 'placeholder' });
 * console.log(d1.detect(text).redacted); // 'Email: [EMAIL_1]'
 *
 * // mask-middle mode
 * const d2 = new OpenRedaction({ redactionMode: 'mask-middle' });
 * console.log(d2.detect(text).redacted); // 'Email: j***@example.com'
 *
 * // mask-all mode
 * const d3 = new OpenRedaction({ redactionMode: 'mask-all' });
 * console.log(d3.detect(text).redacted); // 'Email: *****************'
 * ```
 */
export type RedactionMode =
  | 'placeholder'        // Default: [EMAIL_1234]
  | 'mask-middle'        // Partial: j***@example.com, 555-**-1234
  | 'mask-all'           // Full: ***************
  | 'format-preserving'  // Keep structure: XXX-XX-XXXX
  | 'token-replace';     // Fake data: john.doe@example.com

/**
 * Configuration options for OpenRedaction detector
 *
 * Comprehensive options for customizing PII detection behavior, including
 * pattern selection, compliance presets, performance tuning, and advanced
 * features like context analysis and learning.
 *
 * @example Basic configuration
 * ```typescript
 * const detector = new OpenRedaction({
 *   preset: 'gdpr',
 *   redactionMode: 'placeholder',
 *   deterministic: true
 * });
 * ```
 *
 * @example Performance optimization
 * ```typescript
 * const detector = new OpenRedaction({
 *   categories: ['contact'],  // Only emails and phones (97.8% faster)
 *   enableCache: true,
 *   cacheSize: 1000
 * });
 * ```
 *
 * @example Advanced features
 * ```typescript
 * const detector = new OpenRedaction({
 *   enableContextAnalysis: true,     // Boost confidence based on context
 *   enableFalsePositiveFilter: true, // Filter common false positives
 *   enableMultiPass: true,            // Multi-pass for better accuracy
 *   confidenceThreshold: 0.7,         // Only report high-confidence detections
 *   enableLearning: true,             // Learn from feedback
 *   debug: true                       // Enable debug logging
 * });
 * ```
 */
export interface OpenRedactionOptions {
  /** Include name detection (default: true) */
  includeNames?: boolean;
  /** Include address detection (default: true) */
  includeAddresses?: boolean;
  /** Include phone detection (default: true) */
  includePhones?: boolean;
  /** Include email detection (default: true) */
  includeEmails?: boolean;
  /** Whitelist specific patterns only */
  patterns?: string[];
  /** Add custom patterns */
  customPatterns?: PIIPattern[];
  /** Whitelist of terms to ignore (e.g., company names) */
  whitelist?: string[];
  /** Enable deterministic placeholders (default: true) */
  deterministic?: boolean;
  /** Redaction mode (default: 'placeholder') */
  redactionMode?: RedactionMode;
  /** Compliance preset (single preset, backward compatible) */
  preset?: 'gdpr' | 'hipaa' | 'ccpa' | 'personal' | 'financial' | 'tech' | 'healthcare';
  /** Composable presets (combine multiple presets) */
  presets?: string[];
  /** Enable context-aware detection (default: true) */
  enableContextAnalysis?: boolean;
  /** Minimum confidence threshold for detections (0-1, default: 0.5) */
  confidenceThreshold?: number;
  /** Enable false positive filtering (default: false, experimental) */
  enableFalsePositiveFilter?: boolean;
  /** False positive confidence threshold (0-1, default: 0.7) */
  falsePositiveThreshold?: number;
  /** Enable multi-pass detection for better accuracy (default: false, experimental) */
  enableMultiPass?: boolean;
  /** Number of detection passes (2-5, default: 3) */
  multiPassCount?: number;
  /** Enable result caching for repeated inputs (default: false) */
  enableCache?: boolean;
  /** Maximum cache size (default: 100) */
  cacheSize?: number;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Enable audit logging (default: false) */
  enableAuditLog?: boolean;
  /** Audit logger instance (optional, default: in-memory logger) */
  auditLogger?: IAuditLogger;
  /** User context for audit logs */
  auditUser?: string;
  /** Session ID for audit logs */
  auditSessionId?: string;
  /** Additional metadata for audit logs */
  auditMetadata?: Record<string, unknown>;
  /** Enable metrics collection (default: false) */
  enableMetrics?: boolean;
  /** Metrics collector instance (optional, default: in-memory collector) */
  metricsCollector?: IMetricsCollector;
  /** Enable RBAC (Role-Based Access Control) (default: false) */
  enableRBAC?: boolean;
  /** RBAC manager instance (optional, default: admin role) */
  rbacManager?: IRBACManager;
  /** Predefined role name (admin, analyst, operator, viewer) */
  role?: RoleName;
}

/**
 * Validator function type
 */
export type Validator = (value: string, context?: string) => boolean;

/**
 * Audit log entry for tracking redaction operations
 */
export interface AuditLogEntry {
  /** Unique identifier for this audit entry */
  id: string;
  /** Timestamp of the operation (ISO 8601) */
  timestamp: string;
  /** Operation type */
  operation: 'redact' | 'detect' | 'restore';
  /** Number of PII items found/processed */
  piiCount: number;
  /** Types of PII detected (e.g., ["EMAIL", "SSN", "PHONE"]) */
  piiTypes: string[];
  /** Text length processed */
  textLength: number;
  /** Processing time in milliseconds */
  processingTimeMs: number;
  /** Redaction mode used */
  redactionMode?: RedactionMode;
  /** Success status */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
  /** Optional user context */
  user?: string;
  /** Optional session/request identifier */
  sessionId?: string;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Audit logger interface
 */
export interface IAuditLogger {
  /** Log an audit entry */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void;
  /** Get all audit logs */
  getLogs(): AuditLogEntry[];
  /** Get audit logs filtered by operation type */
  getLogsByOperation(operation: AuditLogEntry['operation']): AuditLogEntry[];
  /** Get audit logs filtered by date range */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[];
  /** Export audit logs as JSON */
  exportAsJson(): string;
  /** Export audit logs as CSV */
  exportAsCsv(): string;
  /** Clear all audit logs */
  clear(): void;
  /** Get audit statistics */
  getStats(): AuditStats;
}

/**
 * Audit statistics
 */
export interface AuditStats {
  /** Total number of operations */
  totalOperations: number;
  /** Total PII items detected */
  totalPiiDetected: number;
  /** Average processing time in milliseconds */
  averageProcessingTime: number;
  /** Most common PII types */
  topPiiTypes: Array<{ type: string; count: number }>;
  /** Operations by type */
  operationsByType: Record<string, number>;
  /** Success rate (0-1) */
  successRate: number;
}

/**
 * Metrics for monitoring redaction operations
 */
export interface RedactionMetrics {
  /** Total number of redaction operations */
  totalRedactions: number;
  /** Total number of PII items detected */
  totalPiiDetected: number;
  /** Total processing time in milliseconds */
  totalProcessingTime: number;
  /** Average processing time in milliseconds */
  averageProcessingTime: number;
  /** Total text length processed (characters) */
  totalTextLength: number;
  /** PII detection counts by type */
  piiByType: Record<string, number>;
  /** Operation counts by redaction mode */
  byRedactionMode: Record<string, number>;
  /** Error count */
  totalErrors: number;
  /** Timestamp of last update */
  lastUpdated: string;
}

/**
 * Metrics exporter interface
 */
export interface IMetricsExporter {
  /** Export metrics in Prometheus format */
  exportPrometheus(metrics: RedactionMetrics, prefix?: string): string;
  /** Export metrics in StatsD format */
  exportStatsD(metrics: RedactionMetrics, prefix?: string): string[];
  /** Get current metrics snapshot */
  getMetrics(): RedactionMetrics;
  /** Reset all metrics */
  reset(): void;
}

/**
 * Metrics collector interface
 */
export interface IMetricsCollector {
  /** Record a redaction operation */
  recordRedaction(result: DetectionResult, processingTimeMs: number, redactionMode: RedactionMode): void;
  /** Record an error */
  recordError(): void;
  /** Get metrics exporter */
  getExporter(): IMetricsExporter;
}

/**
 * RBAC Permission - granular access control
 */
export type Permission =
  // Pattern management
  | 'pattern:read'
  | 'pattern:write'
  | 'pattern:delete'
  // Detection operations
  | 'detection:detect'
  | 'detection:redact'
  | 'detection:restore'
  // Audit log access
  | 'audit:read'
  | 'audit:export'
  | 'audit:delete'
  // Metrics access
  | 'metrics:read'
  | 'metrics:export'
  | 'metrics:reset'
  // Configuration
  | 'config:read'
  | 'config:write';

/**
 * RBAC Role - collection of permissions
 */
export interface Role {
  /** Role identifier */
  name: string;
  /** Role description */
  description?: string;
  /** Permissions granted to this role */
  permissions: Permission[];
}

/**
 * Predefined role names
 */
export type RoleName = 'admin' | 'analyst' | 'operator' | 'viewer' | 'custom';

/**
 * RBAC manager interface for access control
 */
export interface IRBACManager {
  /** Check if user has specific permission */
  hasPermission(permission: Permission): boolean;
  /** Check if user has all specified permissions */
  hasAllPermissions(permissions: Permission[]): boolean;
  /** Check if user has any of the specified permissions */
  hasAnyPermission(permissions: Permission[]): boolean;
  /** Get current role */
  getRole(): Role;
  /** Set role */
  setRole(role: Role): void;
  /** Get all permissions for current role */
  getPermissions(): Permission[];
  /** Filter patterns based on read permissions */
  filterPatterns(patterns: PIIPattern[]): PIIPattern[];
}
