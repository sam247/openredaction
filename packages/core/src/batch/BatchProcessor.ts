/**
 * Batch processing for multiple documents
 * Efficient processing of arrays of texts
 */

import { DetectionResult } from '../types';
import { OpenRedaction } from '../detector';

/**
 * Batch processing options
 */
export interface BatchOptions {
  /** Enable parallel processing (default: false) */
  parallel?: boolean;
  /** Maximum concurrency for parallel processing (default: 4) */
  maxConcurrency?: number;
  /** Progress callback */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * Batch processing result
 */
export interface BatchResult {
  /** Individual results for each document */
  results: DetectionResult[];
  /** Total processing stats */
  stats: {
    /** Total documents processed */
    totalDocuments: number;
    /** Total PII detections across all documents */
    totalDetections: number;
    /** Total processing time in milliseconds */
    totalTime: number;
    /** Average time per document */
    avgTimePerDocument: number;
  };
}

/**
 * Batch processor for processing multiple documents
 */
export class BatchProcessor {
  private detector: OpenRedaction;

  constructor(detector: OpenRedaction) {
    this.detector = detector;
  }

  /**
   * Process multiple documents sequentially
   */
  processSequential(
    documents: string[],
    options: BatchOptions = {}
  ): BatchResult {
    const startTime = performance.now();
    const results: DetectionResult[] = [];

    for (let i = 0; i < documents.length; i++) {
      const result = this.detector.detect(documents[i]);
      results.push(result);

      if (options.onProgress) {
        options.onProgress(i + 1, documents.length);
      }
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    return {
      results,
      stats: {
        totalDocuments: documents.length,
        totalDetections: results.reduce((sum, r) => sum + r.detections.length, 0),
        totalTime,
        avgTimePerDocument: totalTime / documents.length
      }
    };
  }

  /**
   * Process multiple documents in parallel
   */
  async processParallel(
    documents: string[],
    options: BatchOptions = {}
  ): Promise<BatchResult> {
    const startTime = performance.now();
    const maxConcurrency = options.maxConcurrency || 4;
    const results: DetectionResult[] = new Array(documents.length);
    let completed = 0;

    // Process in batches of maxConcurrency
    for (let i = 0; i < documents.length; i += maxConcurrency) {
      const batch = documents.slice(i, i + maxConcurrency);
      const batchPromises = batch.map((doc, batchIndex) => {
        return Promise.resolve().then(() => {
          const result = this.detector.detect(doc);
          results[i + batchIndex] = result;
          completed++;

          if (options.onProgress) {
            options.onProgress(completed, documents.length);
          }

          return result;
        });
      });

      await Promise.all(batchPromises);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    return {
      results,
      stats: {
        totalDocuments: documents.length,
        totalDetections: results.reduce((sum, r) => sum + r.detections.length, 0),
        totalTime,
        avgTimePerDocument: totalTime / documents.length
      }
    };
  }

  /**
   * Process multiple documents (automatically chooses sequential or parallel)
   */
  async process(
    documents: string[],
    options: BatchOptions = {}
  ): Promise<BatchResult> {
    if (options.parallel) {
      return this.processParallel(documents, options);
    } else {
      return Promise.resolve(this.processSequential(documents, options));
    }
  }

  /**
   * Process documents with automatic batching
   * Useful for very large arrays of documents
   */
  async *processStream(
    documents: string[],
    batchSize: number = 10
  ): AsyncGenerator<DetectionResult, void, undefined> {
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);

      for (const doc of batch) {
        const result = this.detector.detect(doc);
        yield result;
      }
    }
  }

  /**
   * Get aggregated statistics across multiple results
   */
  getAggregatedStats(results: DetectionResult[]): {
    totalDetections: number;
    detectionsByType: Record<string, number>;
    detectionsBySeverity: Record<string, number>;
    avgConfidence: number;
  } {
    const detectionsByType: Record<string, number> = {};
    const detectionsBySeverity: Record<string, number> = {};
    let totalConfidence = 0;
    let totalWithConfidence = 0;

    for (const result of results) {
      for (const detection of result.detections) {
        // Count by type
        detectionsByType[detection.type] = (detectionsByType[detection.type] || 0) + 1;

        // Count by severity
        detectionsBySeverity[detection.severity] = (detectionsBySeverity[detection.severity] || 0) + 1;

        // Track confidence
        if (detection.confidence !== undefined) {
          totalConfidence += detection.confidence;
          totalWithConfidence++;
        }
      }
    }

    return {
      totalDetections: results.reduce((sum, r) => sum + r.detections.length, 0),
      detectionsByType,
      detectionsBySeverity,
      avgConfidence: totalWithConfidence > 0 ? totalConfidence / totalWithConfidence : 0
    };
  }
}

/**
 * Helper to create a batch processor
 */
export function createBatchProcessor(detector: OpenRedaction): BatchProcessor {
  return new BatchProcessor(detector);
}
