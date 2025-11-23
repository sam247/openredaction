/**
 * Explain API for debugging PII detections
 * Provides detailed insights into why text was or wasn't detected
 */

import { PIIPattern, PIIDetection } from '../types';
import { OpenRedact } from '../detector';
import { analyzeFullContext, ContextAnalysis } from '../context/ContextAnalyzer';
import { isFalsePositive } from '../filters/FalsePositiveFilter';

/**
 * Pattern match result for explain
 */
export interface PatternMatchResult {
  /** Pattern that was tested */
  pattern: PIIPattern;
  /** Whether the pattern matched */
  matched: boolean;
  /** Matched value (if matched) */
  matchedValue?: string;
  /** Position of match (if matched) */
  position?: [number, number];
  /** Why it didn't match or was filtered */
  reason?: string;
  /** Validator result (if validator exists) */
  validatorPassed?: boolean;
  /** Context analysis (if enabled) */
  contextAnalysis?: ContextAnalysis;
  /** False positive check (if enabled) */
  falsePositiveCheck?: {
    isFalsePositive: boolean;
    confidence: number;
    reason?: string;
  };
}

/**
 * Explanation for a specific text
 */
export interface TextExplanation {
  /** Original text */
  text: string;
  /** All pattern match results */
  patternResults: PatternMatchResult[];
  /** Patterns that matched */
  matchedPatterns: PatternMatchResult[];
  /** Patterns that didn't match */
  unmatchedPatterns: PatternMatchResult[];
  /** Patterns that matched but were filtered */
  filteredPatterns: PatternMatchResult[];
  /** Final detections */
  detections: PIIDetection[];
  /** Summary statistics */
  summary: {
    totalPatternsChecked: number;
    patternsMatched: number;
    patternsFiltered: number;
    finalDetections: number;
  };
}

/**
 * Explain API for debugging
 */
export class ExplainAPI {
  private detector: OpenRedact;
  private patterns: PIIPattern[];
  private options: {
    enableContextAnalysis: boolean;
    confidenceThreshold: number;
    enableFalsePositiveFilter: boolean;
    falsePositiveThreshold: number;
    whitelist: string[];
  };

  constructor(detector: OpenRedact) {
    this.detector = detector;
    this.patterns = detector.getPatterns();

    // Test a simple detection to infer options from behavior
    const testResult = detector.detect('Contact: admin@business.co.uk');
    const hasConfidence = testResult.detections.length > 0 && testResult.detections[0].confidence !== undefined;

    // Infer options from detector behavior
    this.options = {
      enableContextAnalysis: hasConfidence,
      confidenceThreshold: 0.5,
      enableFalsePositiveFilter: false,
      falsePositiveThreshold: 0.7,
      whitelist: []
    };
  }

  /**
   * Explain why text was or wasn't detected as PII
   */
  explain(text: string): TextExplanation {
    const patternResults: PatternMatchResult[] = [];
    const matchedPatterns: PatternMatchResult[] = [];
    const unmatchedPatterns: PatternMatchResult[] = [];
    const filteredPatterns: PatternMatchResult[] = [];

    // Test each pattern
    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      const match = regex.exec(text);

      if (!match) {
        // Pattern didn't match
        const result: PatternMatchResult = {
          pattern,
          matched: false,
          reason: 'Pattern regex did not match text'
        };
        patternResults.push(result);
        unmatchedPatterns.push(result);
        continue;
      }

      // Pattern matched - extract value
      const value = match[1] !== undefined ? match[1] : match[0];
      const fullMatch = match[0];

      let startPos: number;
      let endPos: number;

      if (match[1] !== undefined) {
        const captureIndex = fullMatch.indexOf(value);
        startPos = match.index + captureIndex;
        endPos = startPos + value.length;
      } else {
        startPos = match.index;
        endPos = startPos + value.length;
      }

      // Get context for analysis
      const contextStart = Math.max(0, startPos - 50);
      const contextEnd = Math.min(text.length, endPos + 50);
      const context = text.substring(contextStart, contextEnd);

      const result: PatternMatchResult = {
        pattern,
        matched: true,
        matchedValue: value,
        position: [startPos, endPos]
      };

      // Check validator
      if (pattern.validator) {
        const validatorResult = pattern.validator(value, context);
        result.validatorPassed = validatorResult;

        if (!validatorResult) {
          result.reason = 'Failed pattern validator';
          patternResults.push(result);
          filteredPatterns.push(result);
          continue;
        }
      }

      // Check false positive filter
      if (this.options.enableFalsePositiveFilter) {
        const fpResult = isFalsePositive(value, pattern.type, context);
        result.falsePositiveCheck = {
          isFalsePositive: fpResult.isFalsePositive,
          confidence: fpResult.confidence,
          reason: fpResult.matchedRule?.description
        };

        if (fpResult.isFalsePositive && fpResult.confidence >= this.options.falsePositiveThreshold) {
          result.reason = `Filtered as false positive: ${fpResult.matchedRule?.description || 'Unknown reason'}`;
          patternResults.push(result);
          filteredPatterns.push(result);
          continue;
        }
      }

      // Perform context analysis
      if (this.options.enableContextAnalysis) {
        const contextAnalysis = analyzeFullContext(
          text,
          value,
          pattern.type,
          startPos,
          endPos
        );
        result.contextAnalysis = contextAnalysis;

        if (contextAnalysis.confidence < this.options.confidenceThreshold) {
          result.reason = `Low confidence (${(contextAnalysis.confidence * 100).toFixed(1)}% < ${this.options.confidenceThreshold * 100}% threshold)`;
          patternResults.push(result);
          filteredPatterns.push(result);
          continue;
        }
      }

      // Check whitelist
      if (this.options.whitelist.some(term =>
        value.toLowerCase().includes(term.toLowerCase())
      )) {
        result.reason = 'Matched whitelist term';
        patternResults.push(result);
        filteredPatterns.push(result);
        continue;
      }

      // Pattern matched and passed all filters
      patternResults.push(result);
      matchedPatterns.push(result);
    }

    // Get final detections
    const detections = this.detector.detect(text).detections;

    return {
      text,
      patternResults,
      matchedPatterns,
      unmatchedPatterns,
      filteredPatterns,
      detections,
      summary: {
        totalPatternsChecked: this.patterns.length,
        patternsMatched: matchedPatterns.length,
        patternsFiltered: filteredPatterns.length,
        finalDetections: detections.length
      }
    };
  }

  /**
   * Explain a specific detection
   */
  explainDetection(detection: PIIDetection, text: string): {
    detection: PIIDetection;
    pattern?: PIIPattern;
    contextAnalysis?: ContextAnalysis;
    reasoning: string[];
  } {
    const pattern = this.patterns.find(p => p.type === detection.type);
    const reasoning: string[] = [];

    reasoning.push(`Detected as ${detection.type}`);
    reasoning.push(`Severity: ${detection.severity}`);

    if (detection.confidence !== undefined) {
      reasoning.push(`Confidence: ${(detection.confidence * 100).toFixed(1)}%`);
    }

    if (pattern) {
      reasoning.push(`Matched pattern: ${pattern.description || pattern.type}`);
      reasoning.push(`Pattern priority: ${pattern.priority}`);
    }

    let contextAnalysis: ContextAnalysis | undefined;
    if (detection.confidence !== undefined) {
      // If detection has confidence, context analysis was performed
      const [start, end] = detection.position;
      contextAnalysis = analyzeFullContext(
        text,
        detection.value,
        detection.type,
        start,
        end
      );

      if (contextAnalysis) {
        reasoning.push(`Document type: ${contextAnalysis.documentType}`);
        reasoning.push(`Context confidence: ${(contextAnalysis.confidence * 100).toFixed(1)}%`);
      }
    }

    return {
      detection,
      pattern,
      contextAnalysis,
      reasoning
    };
  }

  /**
   * Suggest why text wasn't detected
   */
  suggestWhy(text: string, expectedType: string): {
    text: string;
    expectedType: string;
    suggestions: string[];
    similarPatterns: PIIPattern[];
  } {
    const suggestions: string[] = [];
    const similarPatterns: PIIPattern[] = [];

    // Find patterns of expected type
    const typePatterns = this.patterns.filter(p =>
      p.type === expectedType || p.type.includes(expectedType)
    );

    if (typePatterns.length === 0) {
      suggestions.push(`No patterns found for type: ${expectedType}`);
      suggestions.push('Available types: ' + [...new Set(this.patterns.map(p => p.type))].join(', '));
      return { text, expectedType, suggestions, similarPatterns };
    }

    // Check if any pattern matches
    for (const pattern of typePatterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      const match = regex.exec(text);

      if (match) {
        similarPatterns.push(pattern);
        const value = match[1] !== undefined ? match[1] : match[0];
        suggestions.push(`Pattern "${pattern.type}" matched value: "${value}"`);

        // Check why it was filtered
        const explanation = this.explain(text);
        const filtered = explanation.filteredPatterns.find(r => r.pattern.type === pattern.type);

        if (filtered && filtered.reason) {
          suggestions.push(`But was filtered: ${filtered.reason}`);
        }
      }
    }

    if (similarPatterns.length === 0) {
      suggestions.push(`Text didn't match any ${expectedType} patterns`);
      suggestions.push('Possible reasons:');
      suggestions.push('  - Format doesn\'t match expected pattern');
      suggestions.push('  - Contains invalid characters');
      suggestions.push('  - Fails validation checks');
      suggestions.push('  - Too short or too long');

      // Show example patterns
      if (typePatterns.length > 0) {
        const examplePattern = typePatterns[0];
        suggestions.push(`\nExample ${expectedType} pattern: ${examplePattern.regex.source.substring(0, 100)}...`);
      }
    }

    return {
      text,
      expectedType,
      suggestions,
      similarPatterns
    };
  }

  /**
   * Get debugging information for entire detection process
   */
  debug(text: string): {
    text: string;
    textLength: number;
    enabledFeatures: string[];
    patternCount: number;
    explanation: TextExplanation;
    performance: {
      estimatedTime: string;
    };
  } {
    const start = performance.now();
    const explanation = this.explain(text);
    const duration = performance.now() - start;

    const enabledFeatures: string[] = [];
    if (this.options.enableContextAnalysis) {
      enabledFeatures.push('Context Analysis');
    }
    if (this.options.enableFalsePositiveFilter) {
      enabledFeatures.push('False Positive Filter');
    }
    if (this.options.whitelist.length > 0) {
      enabledFeatures.push(`Whitelist (${this.options.whitelist.length} entries)`);
    }

    return {
      text,
      textLength: text.length,
      enabledFeatures,
      patternCount: this.patterns.length,
      explanation,
      performance: {
        estimatedTime: `${duration.toFixed(2)}ms`
      }
    };
  }
}

/**
 * Helper to create explain API from detector
 */
export function createExplainAPI(detector: OpenRedact): ExplainAPI {
  return new ExplainAPI(detector);
}
