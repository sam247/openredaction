/**
 * Worker thread pool for parallel processing
 */

import { Worker } from 'worker_threads';
import { cpus } from 'os';
import { join } from 'path';
import type { WorkerTask, WorkerResult, WorkerPoolConfig, WorkerPoolStats } from './types';

/**
 * Worker pool for parallel text detection and document processing
 */
export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private taskQueue: Array<{ task: WorkerTask; resolve: Function; reject: Function }> = [];
  private config: Required<WorkerPoolConfig>;
  private stats: WorkerPoolStats;
  private workerPath: string;
  private totalProcessingTime: number = 0;

  constructor(config: WorkerPoolConfig = {}) {
    this.config = {
      numWorkers: config.numWorkers || cpus().length,
      maxQueueSize: config.maxQueueSize || 100,
      idleTimeout: config.idleTimeout || 30000
    };

    this.stats = {
      activeWorkers: 0,
      idleWorkers: 0,
      queueSize: 0,
      totalProcessed: 0,
      totalErrors: 0,
      avgProcessingTime: 0
    };

    // Worker script path (will be in dist after build)
    this.workerPath = join(__dirname, 'worker.js');
  }

  /**
   * Initialize worker pool
   */
  async initialize(): Promise<void> {
    for (let i = 0; i < this.config.numWorkers; i++) {
      await this.createWorker();
    }
  }

  /**
   * Create a new worker
   */
  private async createWorker(): Promise<Worker> {
    const worker = new Worker(this.workerPath);

    worker.on('message', (result: WorkerResult) => {
      this.handleWorkerResult(worker, result);
    });

    worker.on('error', (error) => {
      console.error('[WorkerPool] Worker error:', error);
      this.stats.totalErrors++;
      this.removeWorker(worker);
      // Create replacement worker
      this.createWorker();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`[WorkerPool] Worker exited with code ${code}`);
      }
      this.removeWorker(worker);
    });

    this.workers.push(worker);
    this.availableWorkers.push(worker);
    this.stats.idleWorkers++;

    return worker;
  }

  /**
   * Execute a task on the worker pool
   */
  async execute<T = any>(task: WorkerTask): Promise<T> {
    // Check queue size
    if (this.taskQueue.length >= this.config.maxQueueSize) {
      throw new Error(`[WorkerPool] Queue is full (max: ${this.config.maxQueueSize})`);
    }

    return new Promise((resolve, reject) => {
      this.taskQueue.push({ task, resolve, reject });
      this.stats.queueSize = this.taskQueue.length;
      this.processQueue();
    });
  }

  /**
   * Process task queue
   */
  private processQueue(): void {
    while (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const worker = this.availableWorkers.shift()!;
      const { task, resolve, reject } = this.taskQueue.shift()!;

      this.stats.idleWorkers--;
      this.stats.activeWorkers++;
      this.stats.queueSize = this.taskQueue.length;

      // Store resolve/reject for this task
      (worker as any).__currentTask = { resolve, reject, startTime: Date.now() };

      // Send task to worker
      worker.postMessage(task);
    }
  }

  /**
   * Handle worker result
   */
  private handleWorkerResult(worker: Worker, result: WorkerResult): void {
    const currentTask = (worker as any).__currentTask;
    if (!currentTask) return;

    this.stats.activeWorkers--;
    this.stats.idleWorkers++;
    this.stats.totalProcessed++;

    // Update processing time stats
    this.totalProcessingTime += result.processingTime;
    this.stats.avgProcessingTime = this.totalProcessingTime / this.stats.totalProcessed;

    // Return worker to available pool
    this.availableWorkers.push(worker);
    delete (worker as any).__currentTask;

    // Resolve or reject the promise
    if (result.error) {
      this.stats.totalErrors++;
      currentTask.reject(new Error(result.error));
    } else {
      currentTask.resolve(result.result);
    }

    // Process next task in queue
    this.processQueue();
  }

  /**
   * Remove worker from pool
   */
  private removeWorker(worker: Worker): void {
    const index = this.workers.indexOf(worker);
    if (index !== -1) {
      this.workers.splice(index, 1);
    }

    const availableIndex = this.availableWorkers.indexOf(worker);
    if (availableIndex !== -1) {
      this.availableWorkers.splice(availableIndex, 1);
      this.stats.idleWorkers--;
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): WorkerPoolStats {
    return { ...this.stats };
  }

  /**
   * Terminate all workers
   */
  async terminate(): Promise<void> {
    const terminatePromises = this.workers.map(worker => worker.terminate());
    await Promise.all(terminatePromises);
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
    this.stats.activeWorkers = 0;
    this.stats.idleWorkers = 0;
    this.stats.queueSize = 0;
  }
}

/**
 * Create a worker pool instance
 */
export function createWorkerPool(config?: WorkerPoolConfig): WorkerPool {
  return new WorkerPool(config);
}
