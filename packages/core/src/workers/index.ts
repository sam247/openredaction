/**
 * Worker threads module for parallel processing
 */

export { WorkerPool, createWorkerPool } from './WorkerPool';
export type {
  WorkerTask,
  WorkerResult,
  WorkerPoolConfig,
  WorkerPoolStats,
  DetectTask,
  DocumentTask
} from './types';
