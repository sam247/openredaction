/**
 * OCR (Optical Character Recognition) processor using Tesseract.js
 */

import type { IOCRProcessor, OCROptions, OCRResult } from './types';

/**
 * OCR processor with optional Tesseract.js support
 * Requires peer dependency: tesseract.js
 */
export class OCRProcessor implements IOCRProcessor {
  private tesseract?: any;
  private scheduler?: any;

  constructor() {
    // Try to load optional dependency
    try {
      this.tesseract = require('tesseract.js');
    } catch {
      // tesseract.js not installed
    }
  }

  /**
   * Extract text from image buffer using OCR
   */
  async recognizeText(buffer: Buffer, options?: OCROptions): Promise<OCRResult> {
    if (!this.tesseract) {
      throw new Error(
        '[OCRProcessor] OCR support requires tesseract.js. Install with: npm install tesseract.js'
      );
    }

    const startTime = performance.now();

    try {
      // Configure worker
      const language = Array.isArray(options?.language)
        ? options.language.join('+')
        : options?.language || 'eng';

      const worker = await this.tesseract.createWorker(language, options?.oem || 3);

      // Set page segmentation mode if specified
      if (options?.psm !== undefined) {
        await worker.setParameters({
          tessedit_pageseg_mode: options.psm
        });
      }

      // Perform OCR
      const result = await worker.recognize(buffer);

      // Clean up worker
      await worker.terminate();

      const endTime = performance.now();
      const processingTime = Math.round((endTime - startTime) * 100) / 100;

      return {
        text: result.data.text || '',
        confidence: result.data.confidence || 0,
        processingTime
      };
    } catch (error: any) {
      throw new Error(`[OCRProcessor] OCR recognition failed: ${error.message}`);
    }
  }

  /**
   * Check if OCR is available (tesseract.js installed)
   */
  isAvailable(): boolean {
    return !!this.tesseract;
  }

  /**
   * Create a scheduler for batch OCR processing
   * More efficient for processing multiple images
   */
  async createScheduler(workerCount: number = 4): Promise<any> {
    if (!this.tesseract) {
      throw new Error(
        '[OCRProcessor] OCR support requires tesseract.js. Install with: npm install tesseract.js'
      );
    }

    if (this.scheduler) {
      await this.scheduler.terminate();
    }

    this.scheduler = this.tesseract.createScheduler();

    // Create workers
    const workers = [];
    for (let i = 0; i < workerCount; i++) {
      const worker = await this.tesseract.createWorker('eng');
      this.scheduler.addWorker(worker);
      workers.push(worker);
    }

    return this.scheduler;
  }

  /**
   * Batch process multiple images
   */
  async recognizeBatch(buffers: Buffer[], _options?: OCROptions): Promise<OCRResult[]> {
    if (!this.tesseract) {
      throw new Error(
        '[OCRProcessor] OCR support requires tesseract.js. Install with: npm install tesseract.js'
      );
    }

    // Use scheduler for batch processing
    const scheduler = await this.createScheduler();

    try {
      const results = await Promise.all(
        buffers.map(async (buffer) => {
          const startTime = performance.now();
          const result = await scheduler.addJob('recognize', buffer);
          const endTime = performance.now();

          return {
            text: result.data.text || '',
            confidence: result.data.confidence || 0,
            processingTime: Math.round((endTime - startTime) * 100) / 100
          };
        })
      );

      // Clean up scheduler
      await scheduler.terminate();
      this.scheduler = undefined;

      return results;
    } catch (error: any) {
      // Clean up on error
      if (scheduler) {
        await scheduler.terminate();
        this.scheduler = undefined;
      }
      throw new Error(`[OCRProcessor] Batch OCR failed: ${error.message}`);
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
