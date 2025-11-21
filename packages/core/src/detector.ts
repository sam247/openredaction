/**
 * Main PII Shield detector implementation
 */

import {
  PIIPattern,
  PIIDetection,
  DetectionResult,
  PIIShieldOptions
} from './types';
import { allPatterns } from './patterns';
import { generateDeterministicId } from './utils/hash';
import { getPreset } from './utils/presets';

/**
 * Main PIIShield class for detecting and redacting PII
 */
export class PIIShield {
  private patterns: PIIPattern[];
  private options: {
    includeNames: boolean;
    includeAddresses: boolean;
    includePhones: boolean;
    includeEmails: boolean;
    patterns: string[];
    customPatterns: PIIPattern[];
    whitelist: string[];
    deterministic: boolean;
    preset?: 'gdpr' | 'hipaa' | 'ccpa';
  };
  private valueToPlaceholder: Map<string, string> = new Map();
  private placeholderCounter: Map<string, number> = new Map();

  constructor(options: PIIShieldOptions = {}) {
    // Apply preset if specified
    const presetOptions = options.preset ? getPreset(options.preset) : {};

    // Merge options with defaults
    this.options = {
      includeNames: true,
      includeAddresses: true,
      includePhones: true,
      includeEmails: true,
      patterns: [],
      customPatterns: [],
      whitelist: [],
      deterministic: true,
      ...presetOptions,
      ...options
    };

    // Build pattern list
    this.patterns = this.buildPatternList();

    // Sort by priority (highest first)
    this.patterns.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Build the list of patterns based on options
   */
  private buildPatternList(): PIIPattern[] {
    let patterns: PIIPattern[];

    // If specific patterns are whitelisted, use only those
    if (this.options.patterns && this.options.patterns.length > 0) {
      patterns = allPatterns.filter(p =>
        this.options.patterns!.includes(p.type)
      );
    } else {
      // Use all patterns, filtered by category options
      patterns = allPatterns.filter(pattern => {
        // Filter by category options
        if (pattern.type === 'NAME' && !this.options.includeNames) return false;
        if (pattern.type.startsWith('EMAIL') && !this.options.includeEmails) return false;
        if (pattern.type.startsWith('PHONE') && !this.options.includePhones) return false;
        if (pattern.type.startsWith('ADDRESS') && !this.options.includeAddresses) return false;
        if (pattern.type.startsWith('POSTCODE') && !this.options.includeAddresses) return false;
        if (pattern.type.startsWith('ZIP') && !this.options.includeAddresses) return false;

        return true;
      });
    }

    // Add custom patterns
    if (this.options.customPatterns && this.options.customPatterns.length > 0) {
      patterns.push(...this.options.customPatterns);
    }

    return patterns;
  }

  /**
   * Detect PII in text
   */
  detect(text: string): DetectionResult {
    const startTime = performance.now();

    const detections: PIIDetection[] = [];
    const processedRanges: Array<[number, number]> = [];

    // Reset counters for this detection run if not deterministic
    if (!this.options.deterministic) {
      this.placeholderCounter.clear();
      this.valueToPlaceholder.clear();
    }

    // Process each pattern
    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        // Use capturing group if present, otherwise use full match
        const value = match[1] !== undefined ? match[1] : match[0];
        const fullMatch = match[0];

        // For captured groups, we need to find the actual position
        let startPos: number;
        let endPos: number;

        if (match[1] !== undefined) {
          // Find the captured group position within the full match
          const captureIndex = fullMatch.indexOf(value);
          startPos = match.index + captureIndex;
          endPos = startPos + value.length;
        } else {
          startPos = match.index;
          endPos = startPos + value.length;
        }

        // Skip if this range overlaps with already detected PII (higher priority wins)
        if (this.overlapsWithExisting(startPos, endPos, processedRanges)) {
          continue;
        }

        // Get context (50 chars before and after)
        const contextStart = Math.max(0, startPos - 50);
        const contextEnd = Math.min(text.length, endPos + 50);
        const context = text.substring(contextStart, contextEnd);

        // Run validator if present
        if (pattern.validator && !pattern.validator(value, context)) {
          continue;
        }

        // Check whitelist
        if (this.options.whitelist.some(term =>
          value.toLowerCase().includes(term.toLowerCase())
        )) {
          continue;
        }

        // Generate placeholder
        const placeholder = this.generatePlaceholder(value, pattern);

        // Add detection
        detections.push({
          type: pattern.type,
          value,
          placeholder,
          position: [startPos, endPos],
          severity: pattern.severity || 'medium'
        });

        // Mark range as processed
        processedRanges.push([startPos, endPos]);
      }
    }

    // Sort detections by position (descending) for proper replacement
    detections.sort((a, b) => b.position[0] - a.position[0]);

    // Build redacted text and redaction map
    let redacted = text;
    const redactionMap: Record<string, string> = {};

    for (const detection of detections) {
      const [start, end] = detection.position;
      redacted = redacted.substring(0, start) +
        detection.placeholder +
        redacted.substring(end);

      redactionMap[detection.placeholder] = detection.value;
    }

    const endTime = performance.now();

    return {
      original: text,
      redacted,
      detections: detections.reverse(), // Return in original order
      redactionMap,
      stats: {
        processingTime: Math.round((endTime - startTime) * 100) / 100,
        piiCount: detections.length
      }
    };
  }

  /**
   * Restore redacted text using redaction map
   */
  restore(redactedText: string, redactionMap: Record<string, string>): string {
    let restored = redactedText;

    for (const [placeholder, value] of Object.entries(redactionMap)) {
      restored = restored.replace(new RegExp(this.escapeRegex(placeholder), 'g'), value);
    }

    return restored;
  }

  /**
   * Generate placeholder for a detected value
   */
  private generatePlaceholder(value: string, pattern: PIIPattern): string {
    // Check if we've seen this value before (for deterministic mode)
    if (this.options.deterministic && this.valueToPlaceholder.has(value)) {
      return this.valueToPlaceholder.get(value)!;
    }

    let placeholder: string;

    if (this.options.deterministic) {
      // Generate deterministic ID based on value
      const id = generateDeterministicId(value, pattern.type);
      placeholder = pattern.placeholder.replace('{n}', id);
    } else {
      // Use incrementing counter
      const count = (this.placeholderCounter.get(pattern.type) || 0) + 1;
      this.placeholderCounter.set(pattern.type, count);
      placeholder = pattern.placeholder.replace('{n}', count.toString());
    }

    // Store mapping
    this.valueToPlaceholder.set(value, placeholder);

    return placeholder;
  }

  /**
   * Check if a range overlaps with existing detections
   */
  private overlapsWithExisting(
    start: number,
    end: number,
    ranges: Array<[number, number]>
  ): boolean {
    return ranges.some(
      ([existingStart, existingEnd]) =>
        (start >= existingStart && start < existingEnd) ||
        (end > existingStart && end <= existingEnd) ||
        (start <= existingStart && end >= existingEnd)
    );
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get the list of active patterns
   */
  getPatterns(): PIIPattern[] {
    return [...this.patterns];
  }

  /**
   * Get severity-based scan results
   */
  scan(text: string): {
    high: PIIDetection[];
    medium: PIIDetection[];
    low: PIIDetection[];
    total: number;
  } {
    const result = this.detect(text);

    return {
      high: result.detections.filter(d => d.severity === 'high'),
      medium: result.detections.filter(d => d.severity === 'medium'),
      low: result.detections.filter(d => d.severity === 'low'),
      total: result.detections.length
    };
  }
}
