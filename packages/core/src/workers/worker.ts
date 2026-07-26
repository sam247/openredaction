/**
 * Worker thread script for parallel processing
 */

import { parentPort } from "worker_threads";
import { OpenRedaction } from "../detector";
import { detectDocument } from "../document/detectDocument";
import type { DocumentResult } from "../document/types";
import type { DetectionResult } from "../types";
import { errorMessage } from "../utils/optional-require";
import type { WorkerResult, WorkerTask } from "./types";

// Initialize OpenRedaction instance
let redactor: OpenRedaction | null = null;

/**
 * Process incoming tasks
 */
parentPort?.on("message", async (task: WorkerTask) => {
  const startTime = performance.now();

  try {
    let result: DetectionResult | DocumentResult;

    switch (task.type) {
      case "detect":
        if (!redactor) {
          redactor = new OpenRedaction(task.options);
        }
        result = await redactor.detect(task.text);
        break;

      case "document":
        if (!redactor) {
          redactor = new OpenRedaction();
        }
        result = await detectDocument(redactor, task.buffer, task.options);
        break;

      default:
        throw new Error(
          `Unknown task type: ${(task as { type: string }).type}`,
        );
    }

    const endTime = performance.now();
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    const workerResult: WorkerResult = {
      id: task.id,
      result,
      processingTime,
    };

    parentPort?.postMessage(workerResult);
  } catch (error) {
    const endTime = performance.now();
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    const workerResult: WorkerResult = {
      id: task.id,
      result: null,
      error: errorMessage(error),
      processingTime,
    };

    parentPort?.postMessage(workerResult);
  }
});
