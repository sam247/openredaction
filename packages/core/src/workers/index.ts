/**
 * Worker threads module for parallel processing
 */

export type {
  DetectTask,
  DocumentTask,
  WorkerPoolConfig,
  WorkerPoolStats,
  WorkerResult,
  WorkerTask,
} from "./types";
export { createWorkerPool, WorkerPool } from "./WorkerPool";
