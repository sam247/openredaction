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
}

/**
 * Validator function type
 */
export type Validator = (value: string, context?: string) => boolean;
