/**
 * Main OpenRedaction detector implementation
 */

import {
  PIIPattern,
  PIIDetection,
  DetectionResult,
  OpenRedactionOptions
} from './types';
import { allPatterns } from './patterns';
import { generateDeterministicId } from './utils/hash';
import { getPreset } from './utils/presets';
import { LocalLearningStore } from './learning/LocalLearningStore.js';
import { ConfigLoader } from './config/ConfigLoader.js';
import { analyzeFullContext } from './context/ContextAnalyzer.js';
import { isFalsePositive } from './filters/FalsePositiveFilter.js';
import { createSimpleMultiPass, groupPatternsByPass, mergePassDetections, type DetectionPass } from './multipass/MultiPassDetector.js';
import { LRUCache, hashString } from './utils/cache.js';
import { ExplainAPI, createExplainAPI } from './explain/ExplainAPI.js';
import { createReportGenerator, type ReportOptions } from './reports/ReportGenerator.js';
import { PriorityOptimizer, createPriorityOptimizer, type OptimizerOptions } from './optimizer/PriorityOptimizer.js';

/**
 * Main OpenRedaction class for detecting and redacting PII
 */
export class OpenRedaction {
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
    enableContextAnalysis: boolean;
    confidenceThreshold: number;
    enableFalsePositiveFilter: boolean;
    falsePositiveThreshold: number;
    enableMultiPass: boolean;
    multiPassCount: number;
    enableCache: boolean;
    cacheSize: number;
    enablePriorityOptimization: boolean;
    optimizerOptions: OptimizerOptions;
  };
  private multiPassConfig?: DetectionPass[];
  private resultCache?: LRUCache<string, DetectionResult>;
  private valueToPlaceholder: Map<string, string> = new Map();
  private placeholderCounter: Map<string, number> = new Map();
  private learningStore?: LocalLearningStore;
  private priorityOptimizer?: PriorityOptimizer;
  private enableLearning: boolean;

  constructor(options: OpenRedactionOptions & {
    configPath?: string;
    enableLearning?: boolean;
    learningStorePath?: string;
    enablePriorityOptimization?: boolean;
    optimizerOptions?: Partial<OptimizerOptions>;
  } = {}) {
    // Apply preset if specified
    const presetOptions = options.preset ? getPreset(options.preset) : {};

    // Merge options with defaults
    const mergedOptions = {
      includeNames: true,
      includeAddresses: true,
      includePhones: true,
      includeEmails: true,
      patterns: [],
      customPatterns: [],
      whitelist: [],
      deterministic: true,
      enableContextAnalysis: true, // Enabled by default (fine-tuned)
      confidenceThreshold: 0.5, // Balanced threshold (filters <50% confidence)
      enableFalsePositiveFilter: false, // Disabled by default (experimental)
      falsePositiveThreshold: 0.7,
      enableMultiPass: false, // Disabled by default (opt-in for better accuracy)
      multiPassCount: 3, // Default: 3 passes when enabled
      enableCache: false, // Disabled by default (opt-in for high-volume usage)
      cacheSize: 100, // Default: cache up to 100 results
      enablePriorityOptimization: false, // Disabled by default (opt-in)
      ...presetOptions,
      ...options
    };

    this.options = {
      ...mergedOptions,
      optimizerOptions: {
        learningWeight: options.optimizerOptions?.learningWeight ?? 0.3,
        minSampleSize: options.optimizerOptions?.minSampleSize ?? 10,
        maxPriorityAdjustment: options.optimizerOptions?.maxPriorityAdjustment ?? 15
      }
    };

    // Initialize result cache if enabled
    if (this.options.enableCache) {
      this.resultCache = new LRUCache<string, DetectionResult>(this.options.cacheSize);
    }

    // Initialize multi-pass configuration if enabled
    if (this.options.enableMultiPass) {
      this.multiPassConfig = createSimpleMultiPass({
        numPasses: this.options.multiPassCount,
        prioritizeCredentials: true
      });
    }

    // Enable learning by default
    this.enableLearning = options.enableLearning ?? true;

    // Initialize learning store if enabled
    if (this.enableLearning) {
      const learningPath = options.learningStorePath || '.openredaction/learnings.json';
      this.learningStore = new LocalLearningStore(learningPath, {
        autoSave: true,
        confidenceThreshold: 0.85
      });

      // Merge learned whitelist with user whitelist
      const learnedWhitelist = this.learningStore.getWhitelist();
      this.options.whitelist = [...this.options.whitelist, ...learnedWhitelist];

      // Initialize priority optimizer if enabled
      if (this.options.enablePriorityOptimization) {
        this.priorityOptimizer = createPriorityOptimizer(
          this.learningStore,
          this.options.optimizerOptions
        );
      }
    }

    // Build pattern list
    this.patterns = this.buildPatternList();

    // Apply priority optimization if enabled
    if (this.priorityOptimizer) {
      this.patterns = this.priorityOptimizer.optimizePatterns(this.patterns);
    }

    // Sort by priority (highest first)
    this.patterns.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Create OpenRedaction instance from config file
   */
  static async fromConfig(configPath?: string): Promise<OpenRedaction> {
    const loader = new ConfigLoader(configPath);
    const config = await loader.load();

    if (!config) {
      return new OpenRedaction();
    }

    const resolved = loader.resolveConfig(config);

    return new OpenRedaction({
      ...resolved,
      enableLearning: true,
      learningStorePath: config.learnedPatterns
    });
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
   * Process patterns and detect PII
   * Used by both single-pass and multi-pass detection
   */
  private processPatterns(
    text: string,
    patterns: PIIPattern[],
    processedRanges: Array<[number, number]>
  ): PIIDetection[] {
    const detections: PIIDetection[] = [];

    // Process each pattern
    for (const pattern of patterns) {
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

        // Check for false positives if enabled
        if (this.options.enableFalsePositiveFilter) {
          const fpResult = isFalsePositive(value, pattern.type, context);
          if (fpResult.isFalsePositive && fpResult.confidence >= this.options.falsePositiveThreshold) {
            // Skip this detection - likely a false positive
            continue;
          }
        }

        // Perform context analysis if enabled
        let confidence = 1.0; // Default confidence if analysis disabled
        if (this.options.enableContextAnalysis) {
          const contextAnalysis = analyzeFullContext(
            text,
            value,
            pattern.type,
            startPos,
            endPos
          );
          confidence = contextAnalysis.confidence;

          // Filter low-confidence detections
          if (confidence < this.options.confidenceThreshold) {
            continue;
          }
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
          severity: pattern.severity || 'medium',
          confidence
        });

        // Mark range as processed
        processedRanges.push([startPos, endPos]);
      }
    }

    return detections;
  }

  /**
   * Detect PII in text
   */
  detect(text: string): DetectionResult {
    const startTime = performance.now();

    // Check cache if enabled
    if (this.resultCache) {
      const cacheKey = hashString(text);
      const cached = this.resultCache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Reset counters for this detection run if not deterministic
    if (!this.options.deterministic) {
      this.placeholderCounter.clear();
      this.valueToPlaceholder.clear();
    }

    let detections: PIIDetection[];
    const processedRanges: Array<[number, number]> = [];

    // Use multi-pass detection if enabled
    if (this.options.enableMultiPass && this.multiPassConfig) {
      // Group patterns by pass
      const patternGroups = groupPatternsByPass(this.patterns, this.multiPassConfig);
      const passDetections = new Map<string, PIIDetection[]>();

      // Process each pass in order
      for (const pass of this.multiPassConfig) {
        const passPatterns = patternGroups.get(pass.name) || [];
        if (passPatterns.length === 0) continue;

        // Process this pass
        const currentDetections = this.processPatterns(text, passPatterns, processedRanges);

        // Store detections for this pass
        passDetections.set(pass.name, currentDetections);

        // Update processed ranges for next pass
        for (const detection of currentDetections) {
          processedRanges.push(detection.position);
        }
      }

      // Merge detections from all passes
      detections = mergePassDetections(passDetections, this.multiPassConfig);
    } else {
      // Single-pass detection (original behavior)
      detections = this.processPatterns(text, this.patterns, processedRanges);
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

    const result: DetectionResult = {
      original: text,
      redacted,
      detections: detections.reverse(), // Return in original order
      redactionMap,
      stats: {
        processingTime: Math.round((endTime - startTime) * 100) / 100,
        piiCount: detections.length
      }
    };

    // Store in cache if enabled
    if (this.resultCache) {
      const cacheKey = hashString(text);
      this.resultCache.set(cacheKey, result);
    }

    return result;
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

  /**
   * Record a false positive (incorrectly detected as PII)
   */
  recordFalsePositive(detection: PIIDetection, context?: string): void {
    if (!this.learningStore) {
      console.warn('Learning is disabled. Enable it by setting enableLearning: true');
      return;
    }

    const ctx = context || '';
    this.learningStore.recordFalsePositive(detection.value, detection.type, ctx);

    // Update whitelist if confidence is high enough
    if (this.learningStore.getConfidence(detection.value) >= 0.85) {
      this.options.whitelist.push(detection.value);
    }
  }

  /**
   * Record a false negative (missed PII that should have been detected)
   */
  recordFalseNegative(text: string, expectedType: string, context?: string): void {
    if (!this.learningStore) {
      console.warn('Learning is disabled. Enable it by setting enableLearning: true');
      return;
    }

    const ctx = context || '';
    this.learningStore.recordFalseNegative(text, expectedType, ctx);
  }

  /**
   * Record a correct detection (for accuracy tracking)
   */
  recordCorrectDetection(): void {
    if (!this.learningStore) {
      return;
    }

    this.learningStore.recordCorrectDetection();
  }

  /**
   * Get learning statistics
   */
  getLearningStats() {
    if (!this.learningStore) {
      return null;
    }

    return this.learningStore.getStats();
  }

  /**
   * Get learned whitelist entries
   */
  getLearnedWhitelist() {
    if (!this.learningStore) {
      return [];
    }

    return this.learningStore.getWhitelistEntries();
  }

  /**
   * Get pattern adjustment suggestions
   */
  getPatternAdjustments() {
    if (!this.learningStore) {
      return [];
    }

    return this.learningStore.getPatternAdjustments();
  }

  /**
   * Export learned patterns for sharing
   */
  exportLearnings(options?: {
    includeContexts?: boolean;
    minConfidence?: number;
  }) {
    if (!this.learningStore) {
      return null;
    }

    return this.learningStore.export(options);
  }

  /**
   * Import learned patterns from another source
   */
  importLearnings(data: any, merge: boolean = true): void {
    if (!this.learningStore) {
      console.warn('Learning is disabled. Enable it by setting enableLearning: true');
      return;
    }

    this.learningStore.import(data, merge);

    // Update whitelist with newly learned patterns
    const learnedWhitelist = this.learningStore.getWhitelist();
    this.options.whitelist = [...new Set([...this.options.whitelist, ...learnedWhitelist])];
  }

  /**
   * Manually add a term to the whitelist
   */
  addToWhitelist(pattern: string, confidence: number = 0.9): void {
    if (!this.learningStore) {
      this.options.whitelist.push(pattern);
      return;
    }

    this.learningStore.addToWhitelist(pattern, confidence);
    this.options.whitelist.push(pattern);
  }

  /**
   * Remove a term from the whitelist
   */
  removeFromWhitelist(pattern: string): void {
    if (this.learningStore) {
      this.learningStore.removeFromWhitelist(pattern);
    }

    this.options.whitelist = this.options.whitelist.filter(w => w !== pattern);
  }

  /**
   * Get the learning store instance
   */
  getLearningStore(): LocalLearningStore | undefined {
    return this.learningStore;
  }

  /**
   * Get the priority optimizer instance
   */
  getPriorityOptimizer(): PriorityOptimizer | undefined {
    return this.priorityOptimizer;
  }

  /**
   * Optimize pattern priorities based on learning data
   * Call this to re-optimize priorities after accumulating new learning data
   */
  optimizePriorities(): void {
    if (!this.priorityOptimizer) {
      console.warn('Priority optimization is disabled. Enable it by setting enablePriorityOptimization: true');
      return;
    }

    // Re-optimize patterns
    this.patterns = this.priorityOptimizer.optimizePatterns(this.patterns);

    // Re-sort by new priorities
    this.patterns.sort((a, b) => b.priority - a.priority);

    // Clear cache if enabled (priorities changed, cached results may be invalid)
    if (this.resultCache) {
      this.resultCache.clear();
    }
  }

  /**
   * Get pattern statistics with learning data
   */
  getPatternStats() {
    if (!this.priorityOptimizer) {
      return null;
    }

    return this.priorityOptimizer.getPatternStats(this.patterns);
  }

  /**
   * Clear the result cache (if caching is enabled)
   */
  clearCache(): void {
    if (this.resultCache) {
      this.resultCache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; enabled: boolean } {
    return {
      size: this.resultCache?.size || 0,
      maxSize: this.options.cacheSize,
      enabled: this.options.enableCache
    };
  }

  /**
   * Create an explain API for debugging detections
   */
  explain(): ExplainAPI {
    return createExplainAPI(this);
  }

  /**
   * Generate a report from detection results
   */
  generateReport(result: DetectionResult, options: ReportOptions): string {
    const generator = createReportGenerator(this);
    return generator.generate(result, options);
  }
}
