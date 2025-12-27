/**
 * Worker thread script for parallel processing
 */

import { parentPort } from 'worker_threads';
import { OpenRedaction } from '../detector';
import type { WorkerTask, WorkerResult } from './types';

// Initialize OpenRedaction instance
let redactor: OpenRedaction | null = null;

/**
 * Process incoming tasks
 */
parentPort?.on('message', async (task: WorkerTask) => {
  const startTime = performance.now();

  try {
    let result: any;

    switch (task.type) {
      case 'detect':
        // Initialize redactor if needed
        if (!redactor) {
          redactor = new OpenRedaction(task.options);
        }
        result = await redactor.detect(task.text);
        break;

      case 'document':
        // Initialize redactor if needed
        if (!redactor) {
          redactor = new OpenRedaction();
        }
        result = await redactor.detectDocument(task.buffer, task.options);
        break;

      default:
        throw new Error(`Unknown task type: ${(task as any).type}`);
    }

    const endTime = performance.now();
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    const workerResult: WorkerResult = {
      id: task.id,
      result,
      processingTime
    };

    parentPort?.postMessage(workerResult);
  } catch (error: any) {
    const endTime = performance.now();
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    const workerResult: WorkerResult = {
      id: task.id,
      result: null,
      error: error.message,
      processingTime
    };

    parentPort?.postMessage(workerResult);
  }
});
