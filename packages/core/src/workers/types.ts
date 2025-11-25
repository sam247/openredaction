/**
 * Worker thread types and interfaces
 */

import type { DetectionResult, OpenRedactionOptions } from '../types';

/**
 * Worker task types
 */
export type WorkerTaskType = 'detect' | 'document';

/**
 * Worker task for text detection
 */
export interface DetectTask {
  type: 'detect';
  id: string;
  text: string;
  options?: OpenRedactionOptions;
}

/**
 * Worker task for document processing
 */
export interface DocumentTask {
  type: 'document';
  id: string;
  buffer: Buffer;
  options?: any;
}

/**
 * Worker task union type
 */
export type WorkerTask = DetectTask | DocumentTask;

/**
 * Worker result
 */
export interface WorkerResult {
  id: string;
  result: DetectionResult | any;
  error?: string;
  processingTime: number;
}

/**
 * Worker pool configuration
 */
export interface WorkerPoolConfig {
  /** Number of worker threads (default: CPU count) */
  numWorkers?: number;
  /** Maximum queue size (default: 100) */
  maxQueueSize?: number;
  /** Worker idle timeout in ms (default: 30000) */
  idleTimeout?: number;
}

/**
 * Worker pool statistics
 */
export interface WorkerPoolStats {
  /** Number of active workers */
  activeWorkers: number;
  /** Number of idle workers */
  idleWorkers: number;
  /** Current queue size */
  queueSize: number;
  /** Total tasks processed */
  totalProcessed: number;
  /** Total errors */
  totalErrors: number;
  /** Average processing time */
  avgProcessingTime: number;
}
