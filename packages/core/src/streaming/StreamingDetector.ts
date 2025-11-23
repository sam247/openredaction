/**
 * Streaming API for processing large documents
 * Allows efficient processing of documents in chunks
 */

import { PIIDetection, DetectionResult } from '../types';
import { OpenRedact } from '../detector';

/**
 * Chunk result for streaming detection
 */
export interface ChunkResult {
  /** Chunk index */
  chunkIndex: number;
  /** Detections found in this chunk */
  detections: PIIDetection[];
  /** Redacted chunk text */
  redactedChunk: string;
  /** Original chunk text */
  originalChunk: string;
  /** Byte offset of this chunk in the original document */
  byteOffset: number;
}

/**
 * Streaming detection options
 */
export interface StreamingOptions {
  /** Chunk size in characters (default: 2048) */
  chunkSize?: number;
  /** Overlap between chunks to catch patterns at boundaries (default: 100) */
  overlap?: number;
  /** Enable progressive redaction (default: true) */
  progressiveRedaction?: boolean;
}

/**
 * Streaming detector for large documents
 */
export class StreamingDetector {
  private detector: OpenRedact;
  private options: Required<StreamingOptions>;

  constructor(detector: OpenRedact, options: StreamingOptions = {}) {
    this.detector = detector;
    this.options = {
      chunkSize: options.chunkSize || 2048,
      overlap: options.overlap || 100,
      progressiveRedaction: options.progressiveRedaction ?? true
    };
  }

  /**
   * Process a large text in chunks
   * Returns an async generator that yields chunk results
   */
  async *processStream(text: string): AsyncGenerator<ChunkResult, void, undefined> {
    const { chunkSize, overlap } = this.options;
    const textLength = text.length;
    let position = 0;
    let chunkIndex = 0;
    const processedRanges = new Set<string>();

    while (position < textLength) {
      // Calculate chunk boundaries
      const start = Math.max(0, position - overlap);
      const end = Math.min(textLength, position + chunkSize);
      const chunk = text.substring(start, end);
      const byteOffset = start;

      // Detect PII in this chunk
      const result = this.detector.detect(chunk);

      // Filter out detections we've already processed
      const newDetections = result.detections.filter(detection => {
        const absoluteStart = byteOffset + detection.position[0];
        const absoluteEnd = byteOffset + detection.position[1];
        const rangeKey = `${absoluteStart}-${absoluteEnd}`;

        // Skip if we've already processed this exact detection
        if (processedRanges.has(rangeKey)) {
          return false;
        }

        // For first chunk, include all detections
        // For subsequent chunks, only include detections in the non-overlap region
        const chunkStartInDoc = position;
        const detectionStartInDoc = absoluteStart;
        const isInMainRegion = chunkIndex === 0 || detectionStartInDoc >= chunkStartInDoc;

        if (isInMainRegion) {
          processedRanges.add(rangeKey);
          return true;
        }

        return false;
      });

      // Adjust positions to be relative to the full document
      const adjustedDetections = newDetections.map(detection => ({
        ...detection,
        position: [
          byteOffset + detection.position[0],
          byteOffset + detection.position[1]
        ] as [number, number]
      }));

      // Build redacted chunk (if progressive redaction is enabled)
      let redactedChunk = chunk;
      if (this.options.progressiveRedaction) {
        // Sort by position descending for proper replacement
        const sortedDetections = [...result.detections].sort(
          (a, b) => b.position[0] - a.position[0]
        );

        for (const detection of sortedDetections) {
          const [start, end] = detection.position;
          redactedChunk =
            redactedChunk.substring(0, start) +
            detection.placeholder +
            redactedChunk.substring(end);
        }
      }

      yield {
        chunkIndex,
        detections: adjustedDetections,
        redactedChunk,
        originalChunk: chunk,
        byteOffset
      };

      // Move to next chunk
      position += chunkSize;
      chunkIndex++;
    }
  }

  /**
   * Process entire stream and collect all results
   */
  async processComplete(text: string): Promise<DetectionResult> {
    const allDetections: PIIDetection[] = [];
    let redactedText = text;

    for await (const chunk of this.processStream(text)) {
      allDetections.push(...chunk.detections);
    }

    // Sort detections by position (descending) for proper replacement
    allDetections.sort((a, b) => b.position[0] - a.position[0]);

    // Build complete redacted text
    const redactionMap: Record<string, string> = {};

    for (const detection of allDetections) {
      const [start, end] = detection.position;
      redactedText =
        redactedText.substring(0, start) +
        detection.placeholder +
        redactedText.substring(end);

      redactionMap[detection.placeholder] = detection.value;
    }

    return {
      original: text,
      redacted: redactedText,
      detections: allDetections.reverse(), // Return in original order
      redactionMap,
      stats: {
        piiCount: allDetections.length
      }
    };
  }

  /**
   * Process a file stream (Node.js only)
   */
  async *processFileStream(
    readableStream: ReadableStream<Uint8Array> | NodeJS.ReadableStream
  ): AsyncGenerator<ChunkResult, void, undefined> {
    const decoder = new TextDecoder();
    let buffer = '';
    const reader = 'getReader' in readableStream
      ? readableStream.getReader()
      : null;

    if (reader) {
      // Web Streams API (browser/modern Node.js)
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete chunks from buffer
          while (buffer.length >= this.options.chunkSize) {
            const chunk = buffer.substring(0, this.options.chunkSize);
            buffer = buffer.substring(this.options.chunkSize);

            // Process this chunk
            for await (const result of this.processStream(chunk)) {
              yield result;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Process remaining buffer
      if (buffer.length > 0) {
        for await (const result of this.processStream(buffer)) {
          yield result;
        }
      }
    } else {
      // Node.js Stream (legacy)
      const nodeStream = readableStream as NodeJS.ReadableStream;

      for await (const chunk of nodeStream) {
        buffer += decoder.decode(chunk as Uint8Array, { stream: true });

        // Process complete chunks from buffer
        while (buffer.length >= this.options.chunkSize) {
          const textChunk = buffer.substring(0, this.options.chunkSize);
          buffer = buffer.substring(this.options.chunkSize);

          // Process this chunk
          for await (const result of this.processStream(textChunk)) {
            yield result;
          }
        }
      }

      // Process remaining buffer
      if (buffer.length > 0) {
        for await (const result of this.processStream(buffer)) {
          yield result;
        }
      }
    }
  }

  /**
   * Get chunk statistics
   */
  getChunkStats(textLength: number): {
    numChunks: number;
    chunkSize: number;
    overlap: number;
    estimatedMemory: number;
  } {
    const numChunks = Math.ceil(textLength / this.options.chunkSize);
    const estimatedMemory = (this.options.chunkSize + this.options.overlap) * 2; // UTF-16 chars

    return {
      numChunks,
      chunkSize: this.options.chunkSize,
      overlap: this.options.overlap,
      estimatedMemory
    };
  }
}

/**
 * Helper to create a streaming detector from OpenRedact instance
 */
export function createStreamingDetector(
  detector: OpenRedact,
  options?: StreamingOptions
): StreamingDetector {
  return new StreamingDetector(detector, options);
}
