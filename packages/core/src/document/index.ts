/**
 * Document processing module
 */

export { DocumentProcessor, createDocumentProcessor } from './DocumentProcessor';
export { OCRProcessor, createOCRProcessor } from './OCRProcessor';
export type {
  DocumentFormat,
  DocumentOptions,
  DocumentResult,
  DocumentMetadata,
  IDocumentProcessor,
  ImageFormat,
  OCRLanguage,
  OCROptions,
  IOCRProcessor,
  OCRResult
} from './types';
