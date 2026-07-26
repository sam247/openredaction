/**
 * OCR (Optical Character Recognition) processor using Tesseract.js
 */

import type { PSM, Scheduler } from "tesseract.js";
import { errorMessage } from "../utils/errors";
import {
  isModuleAvailable,
  loadOptionalModule,
} from "../utils/optional-require";
import type { IOCRProcessor, OCROptions, OCRResult } from "./types";

type TesseractModule = typeof import("tesseract.js");

const INSTALL_HINT =
  "[OCRProcessor] OCR support requires tesseract.js. Install with: npm install tesseract.js";

/**
 * OCR processor with optional Tesseract.js support
 * Requires peer dependency: tesseract.js — loaded lazily on first use
 */
export class OCRProcessor implements IOCRProcessor {
  private tesseract?: TesseractModule | null;
  private scheduler?: Scheduler;

  private loadTesseract(): TesseractModule {
    if (this.tesseract === undefined) {
      this.tesseract =
        loadOptionalModule<TesseractModule>("tesseract.js") ?? null;
    }

    if (!this.tesseract) {
      throw new Error(INSTALL_HINT);
    }

    return this.tesseract;
  }

  /**
   * Extract text from image buffer using OCR
   */
  async recognizeText(
    buffer: Buffer,
    options?: OCROptions,
  ): Promise<OCRResult> {
    const tesseract = this.loadTesseract();
    const startTime = performance.now();

    try {
      const language = Array.isArray(options?.language)
        ? options.language.join("+")
        : options?.language || "eng";

      const worker = await tesseract.createWorker(language, options?.oem ?? 3);

      if (options?.psm !== undefined) {
        await worker.setParameters({
          // PSM is a string enum of "0".."13"; OCROptions.psm carries the same modes numerically
          tessedit_pageseg_mode: String(options.psm) as PSM,
        });
      }

      const result = await worker.recognize(buffer);

      await worker.terminate();

      const endTime = performance.now();
      const processingTime = Math.round((endTime - startTime) * 100) / 100;

      return {
        text: result.data.text || "",
        confidence: result.data.confidence || 0,
        processingTime,
      };
    } catch (error) {
      throw new Error(
        `[OCRProcessor] OCR recognition failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Check if OCR is available (tesseract.js installed)
   */
  isAvailable(): boolean {
    return isModuleAvailable("tesseract.js");
  }

  /**
   * Create a scheduler for batch OCR processing
   * More efficient for processing multiple images
   */
  async createScheduler(workerCount: number = 4): Promise<Scheduler> {
    const tesseract = this.loadTesseract();

    if (this.scheduler) {
      await this.scheduler.terminate();
    }

    this.scheduler = tesseract.createScheduler();

    for (let i = 0; i < workerCount; i++) {
      const worker = await tesseract.createWorker("eng");
      this.scheduler.addWorker(worker);
    }

    return this.scheduler;
  }

  /**
   * Batch process multiple images
   */
  async recognizeBatch(
    buffers: Buffer[],
    _options?: OCROptions,
  ): Promise<OCRResult[]> {
    const scheduler = await this.createScheduler();

    try {
      const results = await Promise.all(
        buffers.map(async (buffer) => {
          const startTime = performance.now();
          const result = await scheduler.addJob("recognize", buffer);
          const endTime = performance.now();

          return {
            text: result.data.text || "",
            confidence: result.data.confidence || 0,
            processingTime: Math.round((endTime - startTime) * 100) / 100,
          };
        }),
      );

      await scheduler.terminate();
      this.scheduler = undefined;

      return results;
    } catch (error) {
      await scheduler.terminate();
      this.scheduler = undefined;
      throw new Error(
        `[OCRProcessor] Batch OCR failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Terminate any running scheduler
   */
  async cleanup(): Promise<void> {
    if (this.scheduler) {
      await this.scheduler.terminate();
      this.scheduler = undefined;
    }
  }
}

/**
 * Create an OCR processor instance
 */
export function createOCRProcessor(): OCRProcessor {
  return new OCRProcessor();
}
