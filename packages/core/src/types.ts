/**
 * Core types for PII Shield
 */

/**
 * PII pattern definition with validation
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
  severity?: 'high' | 'medium' | 'low';
}

/**
 * Detected PII instance
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
  severity: 'high' | 'medium' | 'low';
  /** Confidence score (0-1) based on context analysis */
  confidence?: number;
}

/**
 * Detection result
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
 * Redaction mode - controls how PII is replaced
 */
export type RedactionMode =
  | 'placeholder'        // Default: [EMAIL_1234]
  | 'mask-middle'        // Partial: j***@example.com, 555-**-1234
  | 'mask-all'           // Full: ***************
  | 'format-preserving'  // Keep structure: XXX-XX-XXXX
  | 'token-replace';     // Fake data: john.doe@example.com

/**
 * Configuration options for OpenRedaction
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
  /** Compliance preset */
  preset?: 'gdpr' | 'hipaa' | 'ccpa';
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
