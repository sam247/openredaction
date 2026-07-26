/**
 * Main OpenRedaction detector — thin facade delegating to service modules
 */

import { ConfigExporter } from "./config/ConfigExporter.js";
import { ConfigLoader } from "./config/ConfigLoader.js";
import { AuditManager } from "./detector/AuditManager";
import type { CacheManager } from "./detector/CacheManager";
import {
  createDetectionCore,
  resolveOptions,
} from "./detector/createDetectionCore";
import type { DetectionEngine } from "./detector/DetectionEngine";
import { type DetectorFeatures, resolveFeatures } from "./detector/features";
import { LearningManager } from "./detector/LearningManager";
import { OptimizerManager } from "./detector/OptimizerManager";
import type { PatternManager } from "./detector/PatternManager";
import { restoreRedacted } from "./detector/RedactionUtils";
import type {
  DetectorOptions,
  OpenRedactionConstructorOptions,
} from "./detector/types";
import { createDocumentProcessor } from "./document";
import type { DocumentOptions, DocumentResult } from "./document/types";
import { createExplainAPI, type ExplainAPI } from "./explain/ExplainAPI.js";
import { HealthChecker, type HealthCheckResult } from "./health/HealthCheck.js";
import {
  createReportGenerator,
  type ReportOptions,
} from "./reports/ReportGenerator.js";
import type {
  DetectionResult,
  IAuditLogger,
  IDetector,
  IMetricsCollector,
  IRBACManager,
  OpenRedactionOptions,
  PIIDetection,
  PIIPattern,
} from "./types";
import { createWorkerPool } from "./workers";

export class OpenRedaction implements IDetector {
  options: DetectorOptions;
  private features: DetectorFeatures;
  private patternManager: PatternManager;
  private cacheManager: CacheManager;
  private auditManager: AuditManager;
  private learningManager: LearningManager;
  private optimizerManager: OptimizerManager;
  private detectionEngine: DetectionEngine;

  constructor(options: OpenRedactionConstructorOptions = {}) {
    this.features = resolveFeatures(options.profile, options.features);
    this.options = resolveOptions(options);

    this.learningManager = new LearningManager(
      this.options,
      this.features.learning,
      options.learningStorePath,
    );

    this.optimizerManager = OptimizerManager.create(
      this.features.priorityOptimization,
      this.learningManager.getStore(),
      this.options.optimizerOptions,
    );

    // Providing a collaborator implies enabling its subsystem
    this.auditManager = new AuditManager({
      enableAuditLog:
        this.features.auditLog || options.auditLogger !== undefined,
      auditLogger: options.auditLogger,
      auditUser: options.auditUser,
      auditSessionId: options.auditSessionId,
      auditMetadata: options.auditMetadata,
      enableMetrics:
        this.features.metrics || options.metricsCollector !== undefined,
      metricsCollector: options.metricsCollector,
      enableRBAC:
        this.features.rbac ||
        options.rbacManager !== undefined ||
        options.role !== undefined,
      rbacManager: options.rbacManager,
      role: options.role,
    });

    const optimizer = this.optimizerManager.getOptimizer();
    const core = createDetectionCore(this.options, {
      audit: this.auditManager,
      transformPatterns: optimizer
        ? (patterns) => optimizer.optimizePatterns(patterns)
        : undefined,
    });

    this.cacheManager = core.cacheManager;
    this.patternManager = core.patternManager;
    this.detectionEngine = core.detectionEngine;

    if (this.features.ner) {
      this.detectionEngine.initNER();
    }

    if (this.features.contextRules) {
      this.detectionEngine.initContextRules(options.contextRulesConfig);
    }
  }

  static async fromConfig(configPath?: string): Promise<OpenRedaction> {
    const loader = new ConfigLoader(configPath);
    const config = await loader.load();

    if (!config) {
      return new OpenRedaction();
    }

    const resolved = loader.resolveConfig(config);

    return new OpenRedaction({
      ...resolved,
      features: { learning: true },
      learningStorePath: config.learnedPatterns,
    });
  }

  async detect(text: string): Promise<DetectionResult> {
    if (!this.auditManager.checkPermission("detection:detect")) {
      throw new Error(
        "[OpenRedaction] Permission denied: detection:detect required",
      );
    }

    return this.detectionEngine.detect(text);
  }

  restore(redactedText: string, redactionMap: Record<string, string>): string {
    if (!this.auditManager.checkPermission("detection:restore")) {
      throw new Error(
        "[OpenRedaction] Permission denied: detection:restore required",
      );
    }

    const startTime = performance.now();
    const restored = restoreRedacted(redactedText, redactionMap);
    const endTime = performance.now();
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    this.auditManager.logAudit(
      "restore",
      Object.keys(redactionMap).length,
      [],
      redactedText.length,
      processingTime,
      this.options.redactionMode,
      this.options.debug,
    );

    return restored;
  }

  getPatterns(): PIIPattern[] {
    return this.patternManager.getPatterns();
  }

  async scan(text: string): Promise<{
    high: PIIDetection[];
    medium: PIIDetection[];
    low: PIIDetection[];
    total: number;
  }> {
    const result = await this.detect(text);

    return {
      high: result.detections.filter((d) => d.severity === "high"),
      medium: result.detections.filter((d) => d.severity === "medium"),
      low: result.detections.filter((d) => d.severity === "low"),
      total: result.detections.length,
    };
  }

  recordFalsePositive(detection: PIIDetection, context?: string): void {
    this.learningManager.recordFalsePositive(detection, context);
  }

  recordFalseNegative(
    text: string,
    expectedType: string,
    context?: string,
  ): void {
    this.learningManager.recordFalseNegative(text, expectedType, context);
  }

  recordCorrectDetection(): void {
    this.learningManager.recordCorrectDetection();
  }

  getLearningStats() {
    return this.learningManager.getStats();
  }

  getLearnedWhitelist() {
    return this.learningManager.getLearnedWhitelist();
  }

  getPatternAdjustments() {
    return this.learningManager.getPatternAdjustments();
  }

  exportLearnings(options?: {
    includeContexts?: boolean;
    minConfidence?: number;
  }) {
    return this.learningManager.exportLearnings(options);
  }

  importLearnings(
    data: import("./learning/LocalLearningStore.js").LearningData,
    merge: boolean = true,
  ): void {
    this.learningManager.importLearnings(data, merge);
  }

  addToWhitelist(pattern: string, confidence: number = 0.9): void {
    this.learningManager.addToWhitelist(pattern, confidence);
  }

  removeFromWhitelist(pattern: string): void {
    this.learningManager.removeFromWhitelist(pattern);
  }

  getLearningStore():
    | import("./learning/LocalLearningStore.js").LocalLearningStore
    | undefined {
    return this.learningManager.getStore();
  }

  getPriorityOptimizer():
    | import("./optimizer/PriorityOptimizer.js").PriorityOptimizer
    | undefined {
    return this.optimizerManager.getOptimizer();
  }

  optimizePriorities(): void {
    const optimized = this.optimizerManager.optimizePriorities(
      this.patternManager.getPatterns(),
      this.cacheManager,
    );
    this.patternManager.setPatterns(optimized);
  }

  getPatternStats() {
    return this.optimizerManager.getPatternStats(
      this.patternManager.getPatterns(),
    );
  }

  clearCache(): void {
    this.cacheManager.clear();
  }

  getCacheStats(): { size: number; maxSize: number; enabled: boolean } {
    return this.cacheManager.getStats();
  }

  getAuditLogger(): IAuditLogger | undefined {
    return this.auditManager.getAuditLogger();
  }

  getMetricsCollector(): IMetricsCollector | undefined {
    return this.auditManager.getMetricsCollector();
  }

  getRBACManager(): IRBACManager | undefined {
    return this.auditManager.getRBACManager();
  }

  explain(): ExplainAPI {
    return createExplainAPI(this);
  }

  generateReport(result: DetectionResult, options: ReportOptions): string {
    const generator = createReportGenerator(this);
    return generator.generate(result, options);
  }

  exportConfig(metadata?: {
    description?: string;
    author?: string;
    tags?: string[];
  }): string {
    return ConfigExporter.exportToString(this.options, metadata, true);
  }

  async healthCheck(options?: {
    testDetection?: boolean;
    checkPerformance?: boolean;
    performanceThreshold?: number;
    memoryThreshold?: number;
  }): Promise<HealthCheckResult> {
    const checker = new HealthChecker(this);
    return checker.check(options);
  }

  async quickHealthCheck(): Promise<{
    status: "healthy" | "unhealthy";
    message: string;
  }> {
    const checker = new HealthChecker(this);
    return checker.quickCheck();
  }

  async detectDocument(
    buffer: Buffer,
    options?: DocumentOptions,
  ): Promise<DocumentResult> {
    if (!this.auditManager.checkPermission("detection:detect")) {
      throw new Error(
        "[OpenRedaction] Permission denied: detection:detect required",
      );
    }

    const processor = createDocumentProcessor();

    const extractionStart = performance.now();

    const text = await processor.extractText(buffer, options);
    const metadata = await processor.getMetadata(buffer, options);

    const extractionEnd = performance.now();
    const extractionTime =
      Math.round((extractionEnd - extractionStart) * 100) / 100;

    const detection = await this.detect(text);

    return {
      text,
      metadata,
      detection,
      fileSize: buffer.length,
      extractionTime,
    };
  }

  async detectDocumentFile(
    filePath: string,
    options?: DocumentOptions,
  ): Promise<DocumentResult> {
    if (!this.auditManager.checkPermission("detection:detect")) {
      throw new Error(
        "[OpenRedaction] Permission denied: detection:detect required",
      );
    }

    const fs = await import("fs/promises");
    const buffer = await fs.readFile(filePath);

    return this.detectDocument(buffer, options);
  }

  static async detectBatch(
    texts: string[],
    options?: OpenRedactionOptions & { numWorkers?: number },
  ): Promise<DetectionResult[]> {
    const pool = createWorkerPool({ numWorkers: options?.numWorkers });

    try {
      await pool.initialize();

      const tasks = texts.map((text, index) => ({
        type: "detect" as const,
        id: `detect_${index}`,
        text,
        options,
      }));

      const results = await Promise.all(
        tasks.map((task) => pool.execute<DetectionResult>(task)),
      );

      return results;
    } finally {
      await pool.terminate();
    }
  }

  static async detectDocumentsBatch(
    buffers: Buffer[],
    options?: DocumentOptions & {
      numWorkers?: number;
    },
  ): Promise<DocumentResult[]> {
    const pool = createWorkerPool({ numWorkers: options?.numWorkers });

    try {
      await pool.initialize();

      const tasks = buffers.map((buffer, index) => ({
        type: "document" as const,
        id: `document_${index}`,
        buffer,
        options,
      }));

      const results = await Promise.all(
        tasks.map((task) => pool.execute(task)),
      );

      return results;
    } finally {
      await pool.terminate();
    }
  }
}
