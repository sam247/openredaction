import type { IDetector } from "../types";
import { createDocumentProcessor } from "./DocumentProcessor";
import type { DocumentOptions, DocumentResult } from "./types";

/**
 * Extract text from a document buffer and run PII detection on it.
 */
export async function detectDocument(
  detector: IDetector,
  buffer: Buffer,
  options?: DocumentOptions,
): Promise<DocumentResult> {
  const processor = createDocumentProcessor();

  const extractionStart = performance.now();

  const text = await processor.extractText(buffer, options);
  const metadata = await processor.getMetadata(buffer, options);

  const extractionEnd = performance.now();
  const extractionTime =
    Math.round((extractionEnd - extractionStart) * 100) / 100;

  const detection = await detector.detect(text);

  return {
    text,
    metadata,
    detection,
    fileSize: buffer.length,
    extractionTime,
  };
}

/**
 * Read a file from disk and run document PII detection on it.
 */
export async function detectDocumentFile(
  detector: IDetector,
  filePath: string,
  options?: DocumentOptions,
): Promise<DocumentResult> {
  const fs = await import("node:fs/promises");
  const buffer = await fs.readFile(filePath);

  return detectDocument(detector, buffer, options);
}
