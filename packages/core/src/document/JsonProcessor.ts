/**
 * JSON document processor for PII detection and redaction in structured data
 */

import type { DetectionResult, PIIMatch } from '../types';
import type { Detector } from '../detector';

/**
 * JSON processing options
 */
export interface JsonProcessorOptions {
  /** Maximum depth for nested object traversal (default: 100) */
  maxDepth?: number;
  /** Whether to scan object keys for PII (default: false) */
  scanKeys?: boolean;
  /** Field paths to always redact (e.g., ['user.password', 'auth.token']) */
  alwaysRedact?: string[];
  /** Field paths to never scan (e.g., ['metadata.id', 'timestamp']) */
  skipPaths?: string[];
  /** Field names that indicate PII (boost confidence) */
  piiIndicatorKeys?: string[];
  /** Preserve JSON structure in redacted output (default: true) */
  preserveStructure?: boolean;
}

/**
 * JSON detection result with path tracking
 */
export interface JsonDetectionResult extends DetectionResult {
  /** Paths where PII was detected (e.g., 'user.email', 'contacts[0].phone') */
  pathsDetected: string[];
  /** PII matches with path information */
  matchesByPath: Record<string, PIIMatch[]>;
}

/**
 * Redacted JSON value types
 */
type RedactedValue = string | number | boolean | null | RedactedObject | RedactedValue[];
interface RedactedObject {
  [key: string]: RedactedValue;
}

/**
 * Processor for JSON documents
 */
export class JsonProcessor {
  private readonly defaultOptions: Required<JsonProcessorOptions> = {
    maxDepth: 100,
    scanKeys: false,
    alwaysRedact: [],
    skipPaths: [],
    piiIndicatorKeys: [
      'email', 'e-mail', 'mail',
      'phone', 'tel', 'telephone', 'mobile',
      'ssn', 'social_security',
      'address', 'street', 'city', 'zip', 'postal',
      'name', 'firstname', 'lastname', 'fullname',
      'password', 'pwd', 'secret', 'token', 'key',
      'card', 'credit_card', 'creditcard',
      'account', 'iban', 'swift',
      'passport', 'license', 'licence'
    ],
    preserveStructure: true
  };

  /**
   * Parse JSON from buffer or string
   */
  parse(input: Buffer | string): any {
    try {
      const text = typeof input === 'string' ? input : input.toString('utf-8');
      return JSON.parse(text);
    } catch (error: any) {
      throw new Error(`[JsonProcessor] Invalid JSON: ${error.message}`);
    }
  }

  /**
   * Detect PII in JSON data
   */
  detect(
    data: any,
    detector: Detector,
    options?: JsonProcessorOptions
  ): JsonDetectionResult {
    const opts = { ...this.defaultOptions, ...options };
    const pathsDetected: string[] = [];
    const matchesByPath: Record<string, PIIMatch[]> = {};
    const allMatches: PIIMatch[] = [];

    // Traverse JSON and collect all text values with paths
    this.traverse(data, '', opts, (path, value, key) => {
      // Check if path should be skipped
      if (this.shouldSkip(path, opts.skipPaths)) {
        return;
      }

      // Check if path should always be redacted
      if (this.shouldAlwaysRedact(path, opts.alwaysRedact)) {
        // Mark as high-confidence PII without scanning
        const match: PIIMatch = {
          type: 'SENSITIVE_FIELD',
          value: String(value),
          start: 0,
          end: String(value).length,
          confidence: 1.0,
          context: {
            before: '',
            after: ''
          }
        };
        matchesByPath[path] = [match];
        pathsDetected.push(path);
        allMatches.push(match);
        return;
      }

      // Scan keys if enabled
      if (opts.scanKeys && key) {
        const keyResult = detector.detect(key);
        if (keyResult.piiFound && keyResult.matches.length > 0) {
          const keyPath = `${path}.__key__`;
          matchesByPath[keyPath] = keyResult.matches;
          pathsDetected.push(keyPath);
          allMatches.push(...keyResult.matches);
        }
      }

      // Scan value
      const valueStr = String(value);
      const result = detector.detect(valueStr);

      if (result.piiFound && result.matches.length > 0) {
        // Boost confidence if key indicates PII
        const boostedMatches = this.boostConfidenceFromKey(
          result.matches,
          key,
          opts.piiIndicatorKeys
        );

        matchesByPath[path] = boostedMatches;
        pathsDetected.push(path);
        allMatches.push(...boostedMatches);
      }
    });

    // Calculate statistics
    const uniqueTypes = new Set(allMatches.map(m => m.type));
    const totalPiiCount = allMatches.length;

    return {
      piiFound: totalPiiCount > 0,
      piiCount: totalPiiCount,
      piiTypes: Array.from(uniqueTypes),
      matches: allMatches,
      pathsDetected,
      matchesByPath,
      text: JSON.stringify(data),
      processingTime: 0 // Set by caller
    };
  }

  /**
   * Redact PII in JSON data
   */
  redact(
    data: any,
    detectionResult: JsonDetectionResult,
    options?: JsonProcessorOptions
  ): any {
    const opts = { ...this.defaultOptions, ...options };

    if (!opts.preserveStructure) {
      // Simple text redaction (convert to JSON string, redact, parse back)
      // This is simpler but loses some structure information
      return this.parse(this.redactText(JSON.stringify(data, null, 2), detectionResult));
    }

    // Structure-preserving redaction
    return this.redactPreservingStructure(data, detectionResult.pathsDetected);
  }

  /**
   * Redact specific paths in JSON while preserving structure
   */
  private redactPreservingStructure(data: any, pathsToRedact: string[]): any {
    const pathSet = new Set(pathsToRedact);

    const redactValue = (value: any, currentPath: string): RedactedValue => {
      // Check if current path should be redacted
      if (pathSet.has(currentPath)) {
        if (typeof value === 'string') {
          return '[REDACTED]';
        } else if (typeof value === 'number') {
          return 0;
        } else if (typeof value === 'boolean') {
          return false;
        } else if (value === null) {
          return null;
        } else if (Array.isArray(value)) {
          return [];
        } else if (typeof value === 'object') {
          return {};
        }
        return '[REDACTED]';
      }

      // Recursively process arrays
      if (Array.isArray(value)) {
        return value.map((item, index) =>
          redactValue(item, `${currentPath}[${index}]`)
        );
      }

      // Recursively process objects
      if (value !== null && typeof value === 'object') {
        const result: RedactedObject = {};
        for (const [key, val] of Object.entries(value)) {
          const newPath = currentPath ? `${currentPath}.${key}` : key;
          result[key] = redactValue(val, newPath);
        }
        return result;
      }

      // Primitive values (not in redaction list)
      return value as RedactedValue;
    };

    return redactValue(data, '');
  }

  /**
   * Simple text-based redaction (fallback)
   */
  private redactText(text: string, detectionResult: DetectionResult): string {
    let redacted = text;
    const sortedMatches = [...detectionResult.matches].sort((a, b) => b.start - a.start);

    for (const match of sortedMatches) {
      const placeholder = `[${match.type}_REDACTED]`;
      redacted = redacted.slice(0, match.start) + placeholder + redacted.slice(match.end);
    }

    return redacted;
  }

  /**
   * Traverse JSON structure and call callback for each value
   */
  private traverse(
    obj: any,
    path: string,
    options: Required<JsonProcessorOptions>,
    callback: (path: string, value: any, key?: string) => void,
    depth = 0
  ): void {
    if (depth > options.maxDepth) {
      throw new Error(`[JsonProcessor] Maximum depth (${options.maxDepth}) exceeded`);
    }

    if (obj === null || obj === undefined) {
      return;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const itemPath = path ? `${path}[${index}]` : `[${index}]`;
        if (this.isPrimitive(item)) {
          callback(itemPath, item);
        }
        this.traverse(item, itemPath, options, callback, depth + 1);
      });
      return;
    }

    // Handle objects
    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const valuePath = path ? `${path}.${key}` : key;

        if (this.isPrimitive(value)) {
          callback(valuePath, value, key);
        }

        this.traverse(value, valuePath, options, callback, depth + 1);
      }
      return;
    }

    // Handle primitives at root level
    if (this.isPrimitive(obj)) {
      callback(path, obj);
    }
  }

  /**
   * Check if value is primitive (string, number, boolean)
   */
  private isPrimitive(value: any): boolean {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    );
  }

  /**
   * Check if path should be skipped
   */
  private shouldSkip(path: string, skipPaths: string[]): boolean {
    return skipPaths.some(skipPath => {
      // Exact match
      if (path === skipPath) return true;

      // Wildcard match (e.g., 'users.*.id' matches 'users.123.id')
      const skipRegex = new RegExp('^' + skipPath.replace(/\*/g, '[^.]+') + '$');
      return skipRegex.test(path);
    });
  }

  /**
   * Check if path should always be redacted
   */
  private shouldAlwaysRedact(path: string, alwaysRedact: string[]): boolean {
    return alwaysRedact.some(redactPath => {
      // Exact match
      if (path === redactPath) return true;

      // Wildcard match
      const redactRegex = new RegExp('^' + redactPath.replace(/\*/g, '[^.]+') + '$');
      return redactRegex.test(path);
    });
  }

  /**
   * Boost confidence if key name indicates PII
   */
  private boostConfidenceFromKey(
    matches: PIIMatch[],
    key: string | undefined,
    piiIndicatorKeys: string[]
  ): PIIMatch[] {
    if (!key) return matches;

    const keyLower = key.toLowerCase();
    const isPiiKey = piiIndicatorKeys.some(indicator =>
      keyLower.includes(indicator.toLowerCase())
    );

    if (!isPiiKey) return matches;

    // Boost confidence by 20% (capped at 1.0)
    return matches.map(match => ({
      ...match,
      confidence: Math.min(1.0, match.confidence * 1.2)
    }));
  }

  /**
   * Extract all text values from JSON for simple text-based detection
   */
  extractText(data: any, options?: JsonProcessorOptions): string {
    const opts = { ...this.defaultOptions, ...options };
    const textParts: string[] = [];

    this.traverse(data, '', opts, (path, value, key) => {
      if (opts.scanKeys && key) {
        textParts.push(key);
      }
      if (typeof value === 'string') {
        textParts.push(value);
      }
    });

    return textParts.join(' ');
  }

  /**
   * Validate JSON buffer/string
   */
  isValid(input: Buffer | string): boolean {
    try {
      this.parse(input);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get JSON Lines (JSONL) support - split by newlines and parse each line
   */
  parseJsonLines(input: Buffer | string): any[] {
    const text = typeof input === 'string' ? input : input.toString('utf-8');
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    return lines.map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error: any) {
        throw new Error(`[JsonProcessor] Invalid JSON at line ${index + 1}: ${error.message}`);
      }
    });
  }

  /**
   * Detect PII in JSON Lines format
   */
  detectJsonLines(
    input: Buffer | string,
    detector: Detector,
    options?: JsonProcessorOptions
  ): JsonDetectionResult[] {
    const documents = this.parseJsonLines(input);
    return documents.map(doc => this.detect(doc, detector, options));
  }
}

/**
 * Create a JSON processor instance
 */
export function createJsonProcessor(): JsonProcessor {
  return new JsonProcessor();
}
