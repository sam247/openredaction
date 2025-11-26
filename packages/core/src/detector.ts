/**
 * OpenRedaction - Local-first PII detection and redaction library
 *
 * Main detector implementation for identifying and redacting personally identifiable
 * information (PII) in text. Supports 571+ patterns across 25+ industries with
 * zero runtime dependencies.
 *
 * @packageDocumentation
 */

import {
  PIIPattern,
  PIIDetection,
  DetectionResult,
  OpenRedactionOptions,
  IAuditLogger,
  IMetricsCollector,
  IRBACManager
} from './types';
import { InMemoryAuditLogger } from './audit';
import { InMemoryMetricsCollector } from './metrics';
import { RBACManager, getPredefinedRole } from './rbac';
import { allPatterns, getPatternsByCategory } from './patterns';
import { generateDeterministicId } from './utils/hash';
import { getPreset } from './utils/presets';
import { applyRedactionMode } from './utils/redaction-strategies';
import { LocalLearningStore } from './learning/LocalLearningStore.js';
import { ConfigLoader } from './config/ConfigLoader.js';
import { analyzeFullContext } from './context/ContextAnalyzer.js';
import { isFalsePositive } from './filters/FalsePositiveFilter.js';
import { createSimpleMultiPass, groupPatternsByPass, mergePassDetections, type DetectionPass } from './multipass/MultiPassDetector.js';
import { NERDetector } from './ml/NERDetector.js';
import { ContextRulesEngine, type ContextRulesConfig } from './context/ContextRules.js';
import { SeverityClassifier } from './severity/SeverityClassifier.js';
import type { PIIMatch } from './types';
import { LRUCache, hashString } from './utils/cache.js';
import { ExplainAPI, createExplainAPI } from './explain/ExplainAPI.js';
import { createReportGenerator, type ReportOptions } from './reports/ReportGenerator.js';
import { PriorityOptimizer, createPriorityOptimizer, type OptimizerOptions } from './optimizer/PriorityOptimizer.js';
import {
  createLearningDisabledError,
  createOptimizationDisabledError
} from './errors/OpenRedactionError.js';
import { safeExec, validatePattern, RegexTimeoutError } from './utils/safe-regex.js';

/**
 * Main PII detection and redaction engine
 *
 * Detects and redacts personally identifiable information (PII) from text using
 * 571+ pre-configured patterns. Supports multiple industries, compliance presets
 * (GDPR, HIPAA, CCPA), and advanced features like context analysis, false positive
 * filtering, and multi-pass detection.
 *
 * @example Basic usage
 * ```typescript
 * import { OpenRedaction } from 'openredaction';
 *
 * const detector = new OpenRedaction();
 * const result = detector.detect('Contact John at john@example.com or 555-1234');
 *
 * console.log(result.piiFound); // true
 * console.log(result.detections); // Array of detected PII
 * console.log(result.redacted); // 'Contact John at [EMAIL_1] or [PHONE_1]'
 * ```
 *
 * @example GDPR compliance
 * ```typescript
 * const detector = new OpenRedaction({
 *   preset: 'gdpr',
 *   redactionMode: 'hash',
 *   deterministic: true
 * });
 * ```
 *
 * @example Custom patterns
 * ```typescript
 * const detector = new OpenRedaction({
 *   customPatterns: [{
 *     type: 'EMPLOYEE_ID',
 *     regex: /EMP-\d{6}/g,
 *     priority: 10,
 *     placeholder: '[EMPLOYEE_ID]'
 *   }]
 * });
 * ```
 *
 * @example Category filtering (performance optimization)
 * ```typescript
 * // Only detect emails and phones (97.8% faster)
 * const detector = new OpenRedaction({
 *   categories: ['contact']
 * });
 * ```
 *
 * @example Advanced features
 * ```typescript
 * const detector = new OpenRedaction({
 *   enableContextAnalysis: true,     // Boost confidence based on context
 *   enableFalsePositiveFilter: true, // Filter common false positives
 *   enableMultiPass: true,            // Multi-pass detection for better accuracy
 *   enableCache: true,                // Cache results for repeated text
 *   enableLearning: true,             // Learn from feedback
 *   debug: true                       // Enable debug logging
 * });
 * ```
 *
 * @see {@link https://github.com/sam247/openredaction OpenRedaction on GitHub}
 */
import type { RedactionMode } from './types';

export class OpenRedaction {
  private patterns: PIIPattern[];
  private compiledPatterns: Map<PIIPattern, RegExp> = new Map(); // Pre-compiled regex cache
  private options: {
    includeNames: boolean;
    includeAddresses: boolean;
    includePhones: boolean;
    includeEmails: boolean;
    patterns: string[];
    categories: string[]; // Pattern categories to include (e.g., ['personal', 'financial'])
    customPatterns: PIIPattern[];
    whitelist: string[];
    deterministic: boolean;
    redactionMode: RedactionMode;
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
    debug: boolean;
    maxInputSize: number; // Maximum input size in bytes (default: 10MB)
    regexTimeout: number; // Regex execution timeout in ms (default: 100ms)
  };
  private multiPassConfig?: DetectionPass[];
  private resultCache?: LRUCache<string, DetectionResult>;
  private valueToPlaceholder: Map<string, string> = new Map();
  private placeholderCounter: Map<string, number> = new Map();
  private learningStore?: LocalLearningStore;
  private priorityOptimizer?: PriorityOptimizer;
  private enableLearning: boolean;
  private auditLogger?: IAuditLogger;
  private auditUser?: string;
  private auditSessionId?: string;
  private auditMetadata?: Record<string, unknown>;
  private metricsCollector?: IMetricsCollector;
  private rbacManager?: IRBACManager;
  private nerDetector?: NERDetector;
  private contextRulesEngine?: ContextRulesEngine;
  private severityClassifier: SeverityClassifier;

  /**
   * Create a new OpenRedaction detector instance
   *
   * @param options - Configuration options for the detector
   * @param options.preset - Compliance preset: 'gdpr', 'hipaa', or 'ccpa'
   * @param options.redactionMode - How to redact PII: 'placeholder', 'hash', 'mask', 'remove', or 'partial'
   * @param options.categories - Pattern categories to include (e.g., ['contact', 'financial']). Empty = all categories
   * @param options.customPatterns - Additional custom PII patterns to detect
   * @param options.whitelist - Values to exclude from detection (e.g., company emails)
   * @param options.deterministic - Use deterministic placeholders for consistent redaction
   * @param options.enableContextAnalysis - Enable context-aware detection (default: true)
   * @param options.confidenceThreshold - Minimum confidence to report detection (0-1, default: 0.5)
   * @param options.enableFalsePositiveFilter - Filter common false positives (default: false)
   * @param options.enableMultiPass - Multi-pass detection for better accuracy (default: false)
   * @param options.enableCache - Cache results for repeated text (default: false)
   * @param options.enableLearning - Learn from feedback to improve accuracy (default: true)
   * @param options.maxInputSize - Maximum input size in bytes (default: 10MB)
   * @param options.regexTimeout - Regex execution timeout in milliseconds (default: 100ms)
   * @param options.debug - Enable debug logging (default: false)
   *
   * @example
   * ```typescript
   * // Basic detector with defaults
   * const detector = new OpenRedaction();
   *
   * // GDPR-compliant detector
   * const gdprDetector = new OpenRedaction({ preset: 'gdpr' });
   *
   * // High-performance detector for emails and phones only
   * const fastDetector = new OpenRedaction({
   *   categories: ['contact'],
   *   enableCache: true
   * });
   * ```
   */
  constructor(options: OpenRedactionOptions & {
    configPath?: string;
    enableLearning?: boolean;
    learningStorePath?: string;
    enablePriorityOptimization?: boolean;
    optimizerOptions?: Partial<OptimizerOptions>;
    enableNER?: boolean;
    enableContextRules?: boolean;
    contextRulesConfig?: ContextRulesConfig;
    maxInputSize?: number;
    regexTimeout?: number;
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
      categories: [], // Empty = use all categories
      customPatterns: [],
      whitelist: [],
      deterministic: true,
      redactionMode: 'placeholder' as RedactionMode, // Default: [EMAIL_1234]
      enableContextAnalysis: true, // Enabled by default (fine-tuned)
      confidenceThreshold: 0.5, // Balanced threshold (filters <50% confidence)
      enableFalsePositiveFilter: false, // Disabled by default (experimental)
      falsePositiveThreshold: 0.7,
      enableMultiPass: false, // Disabled by default (opt-in for better accuracy)
      multiPassCount: 3, // Default: 3 passes when enabled
      enableCache: false, // Disabled by default (opt-in for high-volume usage)
      cacheSize: 100, // Default: cache up to 100 results
      enablePriorityOptimization: false, // Disabled by default (opt-in)
      debug: false, // Disabled by default (opt-in for debugging)
      maxInputSize: 10 * 1024 * 1024, // Default: 10MB max input size
      regexTimeout: 100, // Default: 100ms regex timeout
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

    // Validate all patterns (especially custom ones)
    this.validatePatterns();

    // Pre-compile all regex patterns for performance
    this.precompilePatterns();

    // Apply priority optimization if enabled
    if (this.priorityOptimizer) {
      this.patterns = this.priorityOptimizer.optimizePatterns(this.patterns);
    }

    // Initialize severity classifier (always enabled)
    this.severityClassifier = new SeverityClassifier();

    // Ensure all patterns have severity assigned
    this.patterns = this.severityClassifier.ensureAllSeverity(this.patterns);

    // Sort by priority (highest first)
    this.patterns.sort((a, b) => b.priority - a.priority);

    // Initialize audit logging if enabled
    if (options.enableAuditLog) {
      this.auditLogger = options.auditLogger || new InMemoryAuditLogger();
      this.auditUser = options.auditUser;
      this.auditSessionId = options.auditSessionId;
      this.auditMetadata = options.auditMetadata;
    }

    // Initialize metrics collection if enabled
    if (options.enableMetrics) {
      this.metricsCollector = options.metricsCollector || new InMemoryMetricsCollector();
    }

    // Initialize RBAC if enabled
    if (options.enableRBAC) {
      if (options.rbacManager) {
        this.rbacManager = options.rbacManager;
      } else if (options.role) {
        // Use predefined role
        const role = getPredefinedRole(options.role);
        if (role) {
          this.rbacManager = new RBACManager(role);
        }
      } else {
        // Default to admin role
        this.rbacManager = new RBACManager();
      }
    }

    // Initialize NER detector if enabled (requires compromise.js peer dependency)
    if (options.enableNER) {
      this.nerDetector = new NERDetector();
      if (!this.nerDetector.isAvailable()) {
        console.warn('[OpenRedaction] NER enabled but compromise.js not installed. Install with: npm install compromise');
        console.warn('[OpenRedaction] Falling back to regex-only detection.');
        this.nerDetector = undefined;
      }
    }

    // Initialize context rules engine if enabled
    if (options.enableContextRules !== false) {
      // Enabled by default for better accuracy
      this.contextRulesEngine = new ContextRulesEngine(options.contextRulesConfig);
    }
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
   * Supports three filtering modes (in order of priority):
   * 1. Specific pattern types (patterns option)
   * 2. Pattern categories (categories option) - NEW!
   * 3. All patterns with type-specific filters (includeNames, etc.)
   */
  private buildPatternList(): PIIPattern[] {
    let patterns: PIIPattern[];

    // Priority 1: If specific patterns are whitelisted, use only those
    if (this.options.patterns && this.options.patterns.length > 0) {
      patterns = allPatterns.filter(p =>
        this.options.patterns!.includes(p.type)
      );
    }
    // Priority 2: If categories are specified, use only those categories
    else if (this.options.categories && this.options.categories.length > 0) {
      patterns = [];
      for (const category of this.options.categories) {
        const categoryPatterns = getPatternsByCategory(category);
        patterns.push(...categoryPatterns);
      }
      // Remove duplicates (some patterns may be in multiple categories)
      patterns = Array.from(new Map(patterns.map(p => [p.type, p])).values());

      if (this.options.debug) {
        console.log(`[OpenRedaction] Loaded ${patterns.length} patterns from categories: ${this.options.categories.join(', ')}`);
      }
    }
    // Priority 3: Use all patterns, filtered by category options
    else {
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
   * Validate all patterns to prevent malicious regex injection
   * ONLY validates custom patterns - built-in patterns are already vetted
   * Timeout protection in safeExec() is the primary defense against ReDoS
   */
  private validatePatterns(): void {
    // Only validate custom patterns (user-provided)
    // Built-in patterns are already vetted and safe
    if (!this.options.customPatterns || this.options.customPatterns.length === 0) {
      if (this.options.debug) {
        console.log(`[OpenRedaction] No custom patterns to validate. ${this.patterns.length} built-in patterns loaded.`);
      }
      return;
    }

    // Validate each custom pattern
    for (const customPattern of this.options.customPatterns) {
      try {
        validatePattern(customPattern.regex);
      } catch (error) {
        const errorMsg = `[OpenRedaction] Invalid custom pattern '${customPattern.type}': ${(error as Error).message}`;
        throw new Error(errorMsg); // Security issue - reject invalid custom patterns
      }
    }

    if (this.options.debug) {
      console.log(`[OpenRedaction] Validated ${this.options.customPatterns.length} custom patterns. Total patterns: ${this.patterns.length}`);
    }
  }

  /**
   * Pre-compile all regex patterns for performance
   * Avoids creating new RegExp objects on every detect() call
   */
  private precompilePatterns(): void {
    this.compiledPatterns.clear();

    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      this.compiledPatterns.set(pattern, regex);
    }

    if (this.options.debug) {
      console.log(`[OpenRedaction] Pre-compiled ${this.compiledPatterns.size} regex patterns`);
    }
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
    let detections: PIIDetection[] = [];

    // Process each pattern
    for (const pattern of patterns) {
      // Use pre-compiled regex for performance
      const regex = this.compiledPatterns.get(pattern);
      if (!regex) {
        if (this.options.debug) {
          console.warn(`[OpenRedaction] Pattern '${pattern.type}' not found in compiled cache, skipping`);
        }
        continue;
      }

      let match: RegExpExecArray | null;
      let matchCount = 0;
      const maxMatches = 10000; // Safety limit to prevent infinite loops

      // Reset regex state
      regex.lastIndex = 0;

      try {
        while ((match = safeExec(regex, text, { timeout: this.options.regexTimeout })) !== null) {
          matchCount++;

          // Safety check for excessive matches
          if (matchCount >= maxMatches) {
            if (this.options.debug) {
              console.warn(`[OpenRedaction] Pattern '${pattern.type}' exceeded ${maxMatches} matches, stopping`);
            }
            break;
          }
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
        }

        // Apply context rules for proximity-based confidence adjustment
        if (this.contextRulesEngine) {
          const piiMatch: PIIMatch = {
            type: pattern.type,
            value,
            start: startPos,
            end: endPos,
            confidence,
            context: {
              before: text.substring(Math.max(0, startPos - 250), startPos),
              after: text.substring(endPos, Math.min(text.length, endPos + 250))
            }
          };

          const adjusted = this.contextRulesEngine.applyProximityRules(piiMatch, text);
          confidence = adjusted.confidence;
        }

        // Filter low-confidence detections
        if (confidence < this.options.confidenceThreshold) {
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
          severity: pattern.severity || 'medium',
          confidence
        });

          // Mark range as processed
          processedRanges.push([startPos, endPos]);
        }
      } catch (error) {
        // Handle regex timeout errors gracefully
        if (error instanceof RegexTimeoutError) {
          if (this.options.debug) {
            console.warn(`[OpenRedaction] ${error.message}`);
          }
          // Skip this pattern and continue with others
          continue;
        }
        // Re-throw other errors
        throw error;
      }
    }

    // Apply NER hybrid detection for confidence boosting
    if (this.nerDetector && detections.length > 0) {
      // Convert detections to PIIMatch format
      const piiMatches: PIIMatch[] = detections.map(det => ({
        type: det.type,
        value: det.value,
        start: det.position[0],
        end: det.position[1],
        confidence: det.confidence || 1.0,
        context: {
          before: text.substring(Math.max(0, det.position[0] - 50), det.position[0]),
          after: text.substring(det.position[1], Math.min(text.length, det.position[1] + 50))
        }
      }));

      // Apply hybrid detection
      const hybridMatches = this.nerDetector.hybridDetection(piiMatches, text);

      // Update detections with NER-boosted confidence
      detections = detections.map((det, index) => ({
        ...det,
        confidence: hybridMatches[index].confidence
      }));
    }

    // Apply domain-based confidence boosting
    if (this.contextRulesEngine && detections.length > 0) {
      // Convert detections to PIIMatch format
      const piiMatches: PIIMatch[] = detections.map(det => ({
        type: det.type,
        value: det.value,
        start: det.position[0],
        end: det.position[1],
        confidence: det.confidence || 1.0,
        context: {
          before: text.substring(Math.max(0, det.position[0] - 50), det.position[0]),
          after: text.substring(det.position[1], Math.min(text.length, det.position[1] + 50))
        }
      }));

      // Apply domain boosting
      const boostedMatches = this.contextRulesEngine.applyDomainBoosting(piiMatches, text);

      // Update detections with domain-boosted confidence
      detections = detections.map((det, index) => ({
        ...det,
        confidence: boostedMatches[index].confidence
      }));
    }

    return detections;
  }

  /**
   * Detect PII in text
   *
   * Scans text for personally identifiable information using configured patterns.
   * Returns detected PII with positions, types, confidence scores, and redacted text.
   *
   * @param text - The text to scan for PII
   * @returns Detection result with found PII and redacted text
   *
   * @throws {Error} If text size exceeds maxInputSize limit
   * @throws {Error} If RBAC permission denied (when RBAC is enabled)
   *
   * @example Basic detection
   * ```typescript
   * const result = detector.detect('Email me at john@example.com');
   * console.log(result.piiFound);    // true
   * console.log(result.piiCount);    // 1
   * console.log(result.redacted);    // 'Email me at [EMAIL_1]'
   * console.log(result.detections[0].type);  // 'EMAIL_ADDRESS'
   * console.log(result.detections[0].value); // 'john@example.com'
   * ```
   *
   * @example Working with detection results
   * ```typescript
   * const result = detector.detect('SSN: 123-45-6789, Card: 4532-1234-5678-9010');
   *
   * // Iterate through detections
   * result.detections.forEach(detection => {
   *   console.log(`Found ${detection.type} at position ${detection.position}`);
   *   console.log(`Confidence: ${detection.confidence}`);
   *   console.log(`Severity: ${detection.severity}`);
   * });
   *
   * // Use redacted text
   * console.log(result.redacted);  // 'SSN: [SSN_1], Card: [CREDIT_CARD_1]'
   *
   * // Reverse redaction using map
   * let original = result.redacted;
   * for (const [placeholder, value] of Object.entries(result.redactionMap)) {
   *   original = original.replace(placeholder, value);
   * }
   * ```
   *
   * @see {@link DetectionResult} for the structure of returned results
   * @see {@link PIIDetection} for individual detection details
   */
  detect(text: string): DetectionResult {
    // Check RBAC permission
    if (this.rbacManager && !this.rbacManager.hasPermission('detection:detect')) {
      throw new Error('[OpenRedaction] Permission denied: detection:detect required');
    }

    const startTime = performance.now();

    // Enforce input size limit (security critical)
    const textSize = new Blob([text]).size;
    if (textSize > this.options.maxInputSize) {
      throw new Error(
        `[OpenRedaction] Input size (${textSize} bytes) exceeds maximum allowed size (${this.options.maxInputSize} bytes). ` +
        `Set maxInputSize option to increase limit or use streaming/batch processing for large documents.`
      );
    }

    // Warn about large documents approaching the limit
    if (textSize > this.options.maxInputSize * 0.8 && this.options.debug) {
      console.warn(
        `[OpenRedaction] Input size (${textSize} bytes) is approaching maximum limit (${this.options.maxInputSize} bytes)`
      );
    }

    if (this.options.debug) {
      console.log(`[OpenRedaction] Detecting PII in ${textSize} byte text`);
      console.log(`[OpenRedaction] Active patterns: ${this.patterns.length}`);
      console.log(`[OpenRedaction] Multi-pass: ${this.options.enableMultiPass ? 'enabled' : 'disabled'}`);
      console.log(`[OpenRedaction] Cache: ${this.options.enableCache ? 'enabled' : 'disabled'}`);
    }

    // Check cache if enabled
    if (this.resultCache) {
      const cacheKey = hashString(text);
      const cached = this.resultCache.get(cacheKey);
      if (cached) {
        if (this.options.debug) {
          console.log('[OpenRedaction] Cache hit, returning cached result');
        }
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
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    const result: DetectionResult = {
      original: text,
      redacted,
      detections: detections.reverse(), // Return in original order
      redactionMap,
      stats: {
        processingTime,
        piiCount: detections.length
      }
    };

    if (this.options.debug) {
      console.log(`[OpenRedaction] Detection complete: ${detections.length} PII found in ${processingTime}ms`);
      if (detections.length > 0) {
        const typeCounts: Record<string, number> = {};
        for (const detection of detections) {
          typeCounts[detection.type] = (typeCounts[detection.type] || 0) + 1;
        }
        console.log(`[OpenRedaction] Detection breakdown:`, typeCounts);
      }
    }

    // Log audit entry if enabled
    if (this.auditLogger) {
      try {
        const piiTypes = [...new Set(detections.map(d => d.type))];
        this.auditLogger.log({
          operation: 'redact',
          piiCount: detections.length,
          piiTypes,
          textLength: text.length,
          processingTimeMs: processingTime,
          redactionMode: this.options.redactionMode,
          success: true,
          user: this.auditUser,
          sessionId: this.auditSessionId,
          metadata: this.auditMetadata
        });
      } catch (error) {
        // Don't fail the redaction if audit logging fails
        if (this.options.debug) {
          console.error('[OpenRedaction] Audit logging failed:', error);
        }
      }
    }

    // Record metrics if enabled
    if (this.metricsCollector) {
      try {
        this.metricsCollector.recordRedaction(result, processingTime, this.options.redactionMode);
      } catch (error) {
        // Don't fail the redaction if metrics recording fails
        if (this.options.debug) {
          console.error('[OpenRedaction] Metrics recording failed:', error);
        }
      }
    }

    // Store in cache if enabled
    if (this.resultCache) {
      const cacheKey = hashString(text);
      this.resultCache.set(cacheKey, result);
      if (this.options.debug) {
        console.log('[OpenRedaction] Result cached');
      }
    }

    return result;
  }

  /**
   * Restore redacted text using redaction map
   */
  restore(redactedText: string, redactionMap: Record<string, string>): string {
    // Check RBAC permission
    if (this.rbacManager && !this.rbacManager.hasPermission('detection:restore')) {
      throw new Error('[OpenRedaction] Permission denied: detection:restore required');
    }

    const startTime = performance.now();
    let restored = redactedText;

    for (const [placeholder, value] of Object.entries(redactionMap)) {
      restored = restored.replace(new RegExp(this.escapeRegex(placeholder), 'g'), value);
    }

    const endTime = performance.now();
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    // Log audit entry if enabled
    if (this.auditLogger) {
      try {
        this.auditLogger.log({
          operation: 'restore',
          piiCount: Object.keys(redactionMap).length,
          piiTypes: [], // Types not available in restore context
          textLength: redactedText.length,
          processingTimeMs: processingTime,
          success: true,
          user: this.auditUser,
          sessionId: this.auditSessionId,
          metadata: this.auditMetadata
        });
      } catch (error) {
        // Don't fail the restore if audit logging fails
        if (this.options.debug) {
          console.error('[OpenRedaction] Audit logging failed:', error);
        }
      }
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

    // For non-placeholder modes, use redaction strategies directly
    if (this.options.redactionMode !== 'placeholder') {
      placeholder = applyRedactionMode(
        value,
        pattern.type,
        this.options.redactionMode,
        pattern.placeholder
      );
      // Still store mapping for consistency
      this.valueToPlaceholder.set(value, placeholder);
      return placeholder;
    }

    // Placeholder mode (default behavior)
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
   *
   * Returns a copy of all PII patterns currently configured for detection,
   * including built-in patterns (filtered by categories) and custom patterns.
   *
   * @returns Array of active PIIPattern objects
   *
   * @example
   * ```typescript
   * const patterns = detector.getPatterns();
   * console.log(`Active patterns: ${patterns.length}`);
   * console.log(`Pattern types: ${patterns.map(p => p.type).join(', ')}`);
   * ```
   */
  getPatterns(): PIIPattern[] {
    return [...this.patterns];
  }

  /**
   * Scan text and categorize detections by severity level
   *
   * Performs PII detection and groups results by severity (high, medium, low).
   * Useful for risk assessment and prioritizing remediation actions.
   *
   * @param text - The text to scan
   * @returns Object with detections grouped by severity level
   *
   * @example
   * ```typescript
   * const results = detector.scan('SSN: 123-45-6789, Email: test@example.com');
   * console.log(`High severity items: ${results.high.length}`);  // SSN
   * console.log(`Medium severity items: ${results.medium.length}`);  // Email
   * console.log(`Total PII found: ${results.total}`);
   *
   * // Review high-severity findings first
   * results.high.forEach(detection => {
   *   console.log(`CRITICAL: ${detection.type} found at position ${detection.position}`);
   * });
   * ```
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
   * Record a false positive detection for learning
   *
   * Reports a value that was incorrectly detected as PII. The learning system
   * will track this feedback and may add it to the whitelist if confidence is high.
   * Requires enableLearning to be true.
   *
   * @param detection - The detection that was incorrectly flagged as PII
   * @param context - Optional context about why this is a false positive
   *
   * @throws {Error} If learning is disabled
   *
   * @example
   * ```typescript
   * const result = detector.detect('Download file.pdf');
   * // Assume 'file.pdf' was incorrectly detected as a FILE_PATH
   *
   * if (result.detections[0].value === 'file.pdf') {
   *   detector.recordFalsePositive(
   *     result.detections[0],
   *     'Generic file extension, not sensitive'
   *   );
   * }
   *
   * // After enough reports, it will be auto-whitelisted
   * ```
   */
  recordFalsePositive(detection: PIIDetection, context?: string): void {
    if (!this.learningStore) {
      throw createLearningDisabledError();
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
      throw createLearningDisabledError();
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
      throw createLearningDisabledError();
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
      throw createOptimizationDisabledError();
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
   *
   * Returns information about the result cache including current size,
   * maximum capacity, and whether caching is enabled.
   *
   * @returns Cache statistics object
   *
   * @example
   * ```typescript
   * const detector = new OpenRedaction({ enableCache: true, cacheSize: 100 });
   *
   * // Perform some detections
   * detector.detect('test1@example.com');
   * detector.detect('test2@example.com');
   *
   * const stats = detector.getCacheStats();
   * console.log(`Cache: ${stats.size}/${stats.maxSize} entries`);
   * console.log(`Cache enabled: ${stats.enabled}`);
   * ```
   */
  getCacheStats(): { size: number; maxSize: number; enabled: boolean } {
    return {
      size: this.resultCache?.size || 0,
      maxSize: this.options.cacheSize,
      enabled: this.options.enableCache
    };
  }

  /**
   * Get the audit logger instance (if audit logging is enabled)
   */
  getAuditLogger(): IAuditLogger | undefined {
    // Check RBAC permission
    if (this.rbacManager && !this.rbacManager.hasPermission('audit:read')) {
      throw new Error('[OpenRedaction] Permission denied: audit:read required');
    }

    return this.auditLogger;
  }

  /**
   * Get the metrics collector instance (if metrics collection is enabled)
   */
  getMetricsCollector(): IMetricsCollector | undefined {
    // Check RBAC permission
    if (this.rbacManager && !this.rbacManager.hasPermission('metrics:read')) {
      throw new Error('[OpenRedaction] Permission denied: metrics:read required');
    }

    return this.metricsCollector;
  }

  /**
   * Get the RBAC manager instance (if RBAC is enabled)
   */
  getRBACManager(): IRBACManager | undefined {
    return this.rbacManager;
  }

  /**
   * Create an explain API for debugging detections
   *
   * Returns an ExplainAPI instance that provides detailed explanations of
   * why text was or wasn't detected as PII. Useful for debugging patterns
   * and understanding detection behavior.
   *
   * @returns ExplainAPI instance for detailed pattern analysis
   *
   * @example
   * ```typescript
   * const detector = new OpenRedaction();
   * const explainer = detector.explain();
   *
   * // Why was this detected?
   * const explanation = explainer.explainText('john@example.com');
   * console.log(explanation.matches);  // Shows which patterns matched
   * console.log(explanation.reasons);  // Why each pattern matched
   *
   * // Test a specific pattern
   * const patternTest = explainer.testPattern('EMAIL_ADDRESS', 'test@example.com');
   * console.log(`Pattern matched: ${patternTest.matched}`);
   * ```
   *
   * @see {@link ExplainAPI} for available explanation methods
   */
  explain(): ExplainAPI {
    return createExplainAPI(this);
  }

  /**
   * Generate a formatted report from detection results
   *
   * Creates a human-readable report in various formats (text, JSON, Markdown,
   * HTML, CSV) summarizing PII detections. Useful for auditing, compliance
   * reporting, and documentation.
   *
   * @param result - The detection result to generate a report from
   * @param options - Report generation options (format, includeStats, etc.)
   * @returns Formatted report as a string
   *
   * @example Text report
   * ```typescript
   * const result = detector.detect('Email: john@example.com, SSN: 123-45-6789');
   * const report = detector.generateReport(result, {
   *   format: 'text',
   *   includeStats: true,
   *   includeSummary: true
   * });
   * console.log(report);
   * ```
   *
   * @example JSON report for API responses
   * ```typescript
   * const report = detector.generateReport(result, {
   *   format: 'json',
   *   includeMetadata: true
   * });
   * const reportData = JSON.parse(report);
   * ```
   *
   * @example CSV report for spreadsheet analysis
   * ```typescript
   * const report = detector.generateReport(result, {
   *   format: 'csv',
   *   groupByType: true
   * });
   * // Import into Excel or Google Sheets
   * ```
   *
   * @see {@link ReportOptions} for available report formats and options
   */
  generateReport(result: DetectionResult, options: ReportOptions): string {
    const generator = createReportGenerator(this);
    return generator.generate(result, options);
  }

  /**
   * Export current configuration
   */
  exportConfig(metadata?: {
    description?: string;
    author?: string;
    tags?: string[];
  }): string {
    const { ConfigExporter } = require('./config/ConfigExporter.js');
    return ConfigExporter.exportToString(this.options, metadata, true);
  }

  /**
   * Run health check
   */
  async healthCheck(options?: {
    testDetection?: boolean;
    checkPerformance?: boolean;
    performanceThreshold?: number;
    memoryThreshold?: number;
  }): Promise<any> {
    const { HealthChecker } = await import('./health/HealthCheck.js');
    const checker = new HealthChecker(this);
    return checker.check(options);
  }

  /**
   * Quick health check (minimal overhead)
   */
  async quickHealthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    const { HealthChecker } = await import('./health/HealthCheck.js');
    const checker = new HealthChecker(this);
    return checker.quickCheck();
  }

  /**
   * Detect PII in a document (PDF, DOCX, TXT)
   * Requires optional peer dependencies:
   * - pdf-parse for PDF support
   * - mammoth for DOCX support
   */
  async detectDocument(
    buffer: Buffer,
    options?: import('./document/types').DocumentOptions
  ): Promise<import('./document/types').DocumentResult> {
    // Check RBAC permission
    if (this.rbacManager && !this.rbacManager.hasPermission('detection:detect')) {
      throw new Error('[OpenRedaction] Permission denied: detection:detect required');
    }

    const { createDocumentProcessor } = await import('./document');
    const processor = createDocumentProcessor();

    const extractionStart = performance.now();

    // Extract text from document
    const text = await processor.extractText(buffer, options);
    const metadata = await processor.getMetadata(buffer, options);

    const extractionEnd = performance.now();
    const extractionTime = Math.round((extractionEnd - extractionStart) * 100) / 100;

    // Detect PII in extracted text
    const detection = this.detect(text);

    return {
      text,
      metadata,
      detection,
      fileSize: buffer.length,
      extractionTime
    };
  }

  /**
   * Detect PII in a document file from filesystem
   * Convenience method that reads file and calls detectDocument
   */
  async detectDocumentFile(
    filePath: string,
    options?: import('./document/types').DocumentOptions
  ): Promise<import('./document/types').DocumentResult> {
    // Check RBAC permission
    if (this.rbacManager && !this.rbacManager.hasPermission('detection:detect')) {
      throw new Error('[OpenRedaction] Permission denied: detection:detect required');
    }

    const fs = await import('fs/promises');
    const buffer = await fs.readFile(filePath);

    return this.detectDocument(buffer, options);
  }

  /**
   * Batch detect PII in multiple texts using worker threads (parallel)
   * Significantly faster for processing many texts
   */
  static async detectBatch(
    texts: string[],
    options?: OpenRedactionOptions & { numWorkers?: number }
  ): Promise<DetectionResult[]> {
    const { createWorkerPool } = await import('./workers');
    const pool = createWorkerPool({ numWorkers: options?.numWorkers });

    try {
      await pool.initialize();

      const tasks = texts.map((text, index) => ({
        type: 'detect' as const,
        id: `detect_${index}`,
        text,
        options
      }));

      const results = await Promise.all(
        tasks.map(task => pool.execute<DetectionResult>(task))
      );

      return results;
    } finally {
      await pool.terminate();
    }
  }

  /**
   * Batch process multiple documents using worker threads (parallel)
   * Efficient for processing many documents at once
   */
  static async detectDocumentsBatch(
    buffers: Buffer[],
    options?: import('./document/types').DocumentOptions & { numWorkers?: number }
  ): Promise<import('./document/types').DocumentResult[]> {
    const { createWorkerPool } = await import('./workers');
    const pool = createWorkerPool({ numWorkers: options?.numWorkers });

    try {
      await pool.initialize();

      const tasks = buffers.map((buffer, index) => ({
        type: 'document' as const,
        id: `document_${index}`,
        buffer,
        options
      }));

      const results = await Promise.all(
        tasks.map(task => pool.execute(task))
      );

      return results;
    } finally {
      await pool.terminate();
    }
  }
}
