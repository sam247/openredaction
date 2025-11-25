/**
 * Document processing types
 */

import type { DetectionResult } from '../types';

/**
 * Supported document formats
 */
export type DocumentFormat = 'pdf' | 'docx' | 'txt';

/**
 * Document processing options
 */
export interface DocumentOptions {
  /** Document format (auto-detected if not specified) */
  format?: DocumentFormat;
  /** Extract text from specific pages (PDF only, 1-indexed) */
  pages?: number[];
  /** Password for encrypted PDFs */
  password?: string;
  /** Maximum document size in bytes (default: 50MB) */
  maxSize?: number;
}

/**
 * Document processing result
 */
export interface DocumentResult {
  /** Extracted text from document */
  text: string;
  /** Document metadata */
  metadata: DocumentMetadata;
  /** Detection result with PII findings */
  detection: DetectionResult;
  /** Original file size in bytes */
  fileSize: number;
  /** Text extraction time in milliseconds */
  extractionTime: number;
}

/**
 * Document metadata
 */
export interface DocumentMetadata {
  /** Document format */
  format: DocumentFormat;
  /** Number of pages (if applicable) */
  pages?: number;
  /** Document title */
  title?: string;
  /** Document author */
  author?: string;
  /** Creation date */
  creationDate?: Date;
  /** Last modified date */
  modifiedDate?: Date;
  /** Additional custom metadata */
  custom?: Record<string, unknown>;
}

/**
 * Document processor interface
 */
export interface IDocumentProcessor {
  /** Extract text from document buffer */
  extractText(buffer: Buffer, options?: DocumentOptions): Promise<string>;
  /** Get document metadata */
  getMetadata(buffer: Buffer, options?: DocumentOptions): Promise<DocumentMetadata>;
  /** Detect supported format from buffer */
  detectFormat(buffer: Buffer): DocumentFormat | null;
  /** Check if format is supported */
  isFormatSupported(format: DocumentFormat): boolean;
}
