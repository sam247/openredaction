/**
 * Document processing types
 */

import type { DetectionResult } from '../types';

/**
 * Supported document formats
 */
export type DocumentFormat = 'pdf' | 'docx' | 'txt' | 'image' | 'json' | 'csv' | 'xlsx';

/**
 * Supported image formats for OCR
 */
export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'tiff' | 'bmp' | 'webp';

/**
 * OCR language codes (Tesseract format)
 */
export type OCRLanguage = 'eng' | 'spa' | 'fra' | 'deu' | 'por' | 'ita' | 'rus' | 'chi_sim' | 'chi_tra' | 'jpn' | 'kor';

/**
 * OCR options
 */
export interface OCROptions {
  /** OCR language (default: 'eng' for English) */
  language?: OCRLanguage | OCRLanguage[];
  /** OCR engine mode (0-3, default: 3 for best accuracy) */
  oem?: 0 | 1 | 2 | 3;
  /** Page segmentation mode (0-13, default: 3 for automatic) */
  psm?: number;
}

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
  /** Enable OCR for image-based content (default: false) */
  enableOCR?: boolean;
  /** OCR configuration options */
  ocrOptions?: OCROptions;
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
  /** OCR confidence (0-100) if OCR was used */
  ocrConfidence?: number;
  /** Whether OCR was used for extraction */
  usedOCR?: boolean;
  /** Additional custom metadata */
  custom?: Record<string, unknown>;
}

/**
 * OCR processor interface
 */
export interface IOCRProcessor {
  /** Extract text from image buffer using OCR */
  recognizeText(buffer: Buffer, options?: OCROptions): Promise<OCRResult>;
  /** Check if OCR is available (tesseract.js installed) */
  isAvailable(): boolean;
}

/**
 * OCR recognition result
 */
export interface OCRResult {
  /** Recognized text */
  text: string;
  /** Confidence score (0-100) */
  confidence: number;
  /** Processing time in milliseconds */
  processingTime: number;
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
