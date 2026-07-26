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

import type { DocumentOptions, DocumentResult } from "../document/types";
import type { DetectionResult, OpenRedactionOptions } from "../types";
import { createWorkerPool } from "./WorkerPool";

/** Detect PII across many texts in parallel using a worker pool. */
export async function detectBatch(
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

    return await Promise.all(
      tasks.map((task) => pool.execute<DetectionResult>(task)),
    );
  } finally {
    await pool.terminate();
  }
}

/** Detect PII across many document buffers in parallel using a worker pool. */
export async function detectDocumentsBatch(
  buffers: Buffer[],
  options?: DocumentOptions & { numWorkers?: number },
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

    return await Promise.all(
      tasks.map((task) => pool.execute<DocumentResult>(task)),
    );
  } finally {
    await pool.terminate();
  }
}
