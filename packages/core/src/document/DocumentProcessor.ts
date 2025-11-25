/**
 * Document text extraction with optional peer dependencies
 */

import type {
  IDocumentProcessor,
  DocumentFormat,
  DocumentOptions,
  DocumentMetadata
} from './types';
import { OCRProcessor } from './OCRProcessor';
import { JsonProcessor } from './JsonProcessor';
import { CsvProcessor } from './CsvProcessor';
import { XlsxProcessor } from './XlsxProcessor';

/**
 * Document processor with optional PDF, DOCX, OCR, JSON, CSV, and XLSX support
 * Requires peer dependencies:
 * - pdf-parse (for PDF)
 * - mammoth (for DOCX)
 * - tesseract.js (for OCR/images)
 * - xlsx (for Excel/XLSX)
 */
export class DocumentProcessor implements IDocumentProcessor {
  private pdfParse?: any;
  private mammoth?: any;
  private ocrProcessor: OCRProcessor;
  private jsonProcessor: JsonProcessor;
  private csvProcessor: CsvProcessor;
  private xlsxProcessor: XlsxProcessor;

  constructor() {
    // Try to load optional dependencies
    try {
      this.pdfParse = require('pdf-parse');
    } catch {
      // pdf-parse not installed
    }

    try {
      this.mammoth = require('mammoth');
    } catch {
      // mammoth not installed
    }

    // Initialize processors
    this.ocrProcessor = new OCRProcessor();
    this.jsonProcessor = new JsonProcessor();
    this.csvProcessor = new CsvProcessor();
    this.xlsxProcessor = new XlsxProcessor();
  }

  /**
   * Extract text from document buffer
   */
  async extractText(buffer: Buffer, options?: DocumentOptions): Promise<string> {
    const format = options?.format || this.detectFormat(buffer);

    if (!format) {
      throw new Error('[DocumentProcessor] Unable to detect document format. Supported: PDF, DOCX, TXT, images (with OCR)');
    }

    // Check size limit
    const maxSize = options?.maxSize || 50 * 1024 * 1024; // 50MB default
    if (buffer.length > maxSize) {
      throw new Error(`[DocumentProcessor] Document size (${buffer.length} bytes) exceeds maximum (${maxSize} bytes)`);
    }

    switch (format) {
      case 'pdf':
        return this.extractPdfText(buffer, options);
      case 'docx':
        return this.extractDocxText(buffer, options);
      case 'txt':
        return buffer.toString('utf-8');
      case 'image':
        return this.extractImageText(buffer, options);
      case 'json':
        return this.extractJsonText(buffer, options);
      case 'csv':
        return this.extractCsvText(buffer, options);
      case 'xlsx':
        return this.extractXlsxText(buffer, options);
      default:
        throw new Error(`[DocumentProcessor] Unsupported format: ${format}`);
    }
  }

  /**
   * Get document metadata
   */
  async getMetadata(buffer: Buffer, options?: DocumentOptions): Promise<DocumentMetadata> {
    const format = options?.format || this.detectFormat(buffer);

    if (!format) {
      throw new Error('[DocumentProcessor] Unable to detect document format');
    }

    switch (format) {
      case 'pdf':
        return this.getPdfMetadata(buffer, options);
      case 'docx':
        return this.getDocxMetadata(buffer, options);
      case 'txt':
        return {
          format: 'txt',
          pages: undefined
        };
      case 'image':
        return this.getImageMetadata(buffer, options);
      case 'json':
        return this.getJsonMetadata(buffer, options);
      case 'csv':
        return this.getCsvMetadata(buffer, options);
      case 'xlsx':
        return this.getXlsxMetadata(buffer, options);
      default:
        throw new Error(`[DocumentProcessor] Unsupported format: ${format}`);
    }
  }

  /**
   * Detect document format from buffer
   */
  detectFormat(buffer: Buffer): DocumentFormat | null {
    if (buffer.length < 4) {
      return null;
    }

    // PDF: starts with %PDF
    if (buffer.toString('utf-8', 0, 4) === '%PDF') {
      return 'pdf';
    }

    // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
    if (buffer.length >= 8 &&
        buffer[0] === 0x89 && buffer[1] === 0x50 &&
        buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image';
    }

    // JPEG: starts with FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'image';
    }

    // TIFF: starts with 49 49 2A 00 (little-endian) or 4D 4D 00 2A (big-endian)
    if ((buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2A && buffer[3] === 0x00) ||
        (buffer[0] === 0x4D && buffer[1] === 0x4D && buffer[2] === 0x00 && buffer[3] === 0x2A)) {
      return 'image';
    }

    // BMP: starts with 42 4D
    if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
      return 'image';
    }

    // WebP: starts with RIFF followed by WEBP at offset 8
    if (buffer.length >= 12 &&
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'image';
    }

    // DOCX/XLSX: ZIP file starting with PK (Office docs are ZIP archives)
    if (buffer[0] === 0x50 && buffer[1] === 0x4B) {
      // Check for [Content_Types].xml which is specific to Office Open XML
      const zipHeader = buffer.toString('utf-8', 0, Math.min(500, buffer.length));
      if (zipHeader.includes('word/') || zipHeader.includes('[Content_Types].xml')) {
        return 'docx';
      }
      if (zipHeader.includes('xl/')) {
        return 'xlsx';
      }
    }

    // JSON: Try to parse as JSON
    const text = buffer.toString('utf-8');
    const trimmed = text.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      if (this.jsonProcessor.isValid(buffer)) {
        return 'json';
      }
    }

    // CSV: Check for delimiter patterns (comma, tab, semicolon, pipe)
    // Look for consistent delimiters across multiple lines
    const lines = text.split(/\r?\n/).slice(0, 5);
    if (lines.length >= 2) {
      const delimiters = [',', '\t', ';', '|'];
      for (const delimiter of delimiters) {
        const counts = lines.map(line => (line.match(new RegExp(delimiter, 'g')) || []).length);
        // If we see consistent delimiter counts > 0, likely CSV
        if (counts[0] > 0 && counts.every(c => c === counts[0])) {
          return 'csv';
        }
      }
    }

    // TXT: assume plain text if no other format detected
    // Check if buffer contains mostly printable ASCII/UTF-8
    const sample = buffer.slice(0, Math.min(1000, buffer.length));
    const nonPrintable = sample.filter(byte => byte < 32 && byte !== 9 && byte !== 10 && byte !== 13).length;
    if (nonPrintable < sample.length * 0.1) {
      return 'txt';
    }

    return null;
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format: DocumentFormat): boolean {
    switch (format) {
      case 'pdf':
        return !!this.pdfParse;
      case 'docx':
        return !!this.mammoth;
      case 'txt':
        return true;
      case 'image':
        return this.ocrProcessor.isAvailable();
      case 'json':
        return true; // Always supported (native)
      case 'csv':
        return true; // Always supported (native)
      case 'xlsx':
        return this.xlsxProcessor.isAvailable();
      default:
        return false;
    }
  }

  /**
   * Extract text from PDF
   */
  private async extractPdfText(buffer: Buffer, options?: DocumentOptions): Promise<string> {
    if (!this.pdfParse) {
      throw new Error(
        '[DocumentProcessor] PDF support requires pdf-parse. Install with: npm install pdf-parse'
      );
    }

    try {
      const data = await this.pdfParse(buffer, {
        password: options?.password,
        max: options?.pages ? Math.max(...options.pages) : undefined
      });

      // If specific pages requested, filter them
      if (options?.pages) {
        // pdf-parse doesn't support per-page text extraction easily
        // Return full text for now (enhancement: implement page filtering)
        return data.text;
      }

      return data.text || '';
    } catch (error: any) {
      throw new Error(`[DocumentProcessor] PDF extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from DOCX
   */
  private async extractDocxText(buffer: Buffer, _options?: DocumentOptions): Promise<string> {
    if (!this.mammoth) {
      throw new Error(
        '[DocumentProcessor] DOCX support requires mammoth. Install with: npm install mammoth'
      );
    }

    try {
      const result = await this.mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (error: any) {
      throw new Error(`[DocumentProcessor] DOCX extraction failed: ${error.message}`);
    }
  }

  /**
   * Get PDF metadata
   */
  private async getPdfMetadata(buffer: Buffer, _options?: DocumentOptions): Promise<DocumentMetadata> {
    if (!this.pdfParse) {
      throw new Error(
        '[DocumentProcessor] PDF support requires pdf-parse. Install with: npm install pdf-parse'
      );
    }

    try {
      const data = await this.pdfParse(buffer, {
        password: _options?.password
      });

      return {
        format: 'pdf',
        pages: data.numpages,
        title: data.info?.Title,
        author: data.info?.Author,
        creationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
        modifiedDate: data.info?.ModDate ? new Date(data.info.ModDate) : undefined,
        custom: data.info
      };
    } catch (error: any) {
      throw new Error(`[DocumentProcessor] PDF metadata extraction failed: ${error.message}`);
    }
  }

  /**
   * Get DOCX metadata
   */
  private async getDocxMetadata(_buffer: Buffer, _options?: DocumentOptions): Promise<DocumentMetadata> {
    // mammoth doesn't provide metadata extraction
    // Basic metadata only
    return {
      format: 'docx',
      pages: undefined // Word doesn't have fixed pages
    };
  }

  /**
   * Extract text from image using OCR
   */
  private async extractImageText(buffer: Buffer, options?: DocumentOptions): Promise<string> {
    if (!this.ocrProcessor.isAvailable()) {
      throw new Error(
        '[DocumentProcessor] Image/OCR support requires tesseract.js. Install with: npm install tesseract.js'
      );
    }

    try {
      const result = await this.ocrProcessor.recognizeText(buffer, options?.ocrOptions);
      return result.text;
    } catch (error: any) {
      throw new Error(`[DocumentProcessor] Image text extraction failed: ${error.message}`);
    }
  }

  /**
   * Get image metadata
   */
  private async getImageMetadata(buffer: Buffer, options?: DocumentOptions): Promise<DocumentMetadata> {
    if (!this.ocrProcessor.isAvailable()) {
      return {
        format: 'image',
        pages: undefined,
        usedOCR: false
      };
    }

    try {
      // Run OCR to get confidence
      const result = await this.ocrProcessor.recognizeText(buffer, options?.ocrOptions);

      return {
        format: 'image',
        pages: undefined,
        usedOCR: true,
        ocrConfidence: result.confidence
      };
    } catch {
      // OCR failed, return basic metadata
      return {
        format: 'image',
        pages: undefined,
        usedOCR: false
      };
    }
  }

  /**
   * Extract text from JSON
   */
  private async extractJsonText(buffer: Buffer, _options?: DocumentOptions): Promise<string> {
    try {
      return this.jsonProcessor.extractText(buffer);
    } catch (error: any) {
      throw new Error(`[DocumentProcessor] JSON extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from CSV
   */
  private async extractCsvText(buffer: Buffer, _options?: DocumentOptions): Promise<string> {
    try {
      return this.csvProcessor.extractText(buffer);
    } catch (error: any) {
      throw new Error(`[DocumentProcessor] CSV extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from XLSX
   */
  private async extractXlsxText(buffer: Buffer, _options?: DocumentOptions): Promise<string> {
    if (!this.xlsxProcessor.isAvailable()) {
      throw new Error(
        '[DocumentProcessor] XLSX support requires xlsx package. Install with: npm install xlsx'
      );
    }

    try {
      return this.xlsxProcessor.extractText(buffer);
    } catch (error: any) {
      throw new Error(`[DocumentProcessor] XLSX extraction failed: ${error.message}`);
    }
  }

  /**
   * Get JSON metadata
   */
  private async getJsonMetadata(buffer: Buffer, _options?: DocumentOptions): Promise<DocumentMetadata> {
    try {
      const data = this.jsonProcessor.parse(buffer);
      const isArray = Array.isArray(data);

      return {
        format: 'json',
        pages: undefined,
        custom: {
          isArray,
          itemCount: isArray ? data.length : Object.keys(data).length
        }
      };
    } catch {
      return {
        format: 'json',
        pages: undefined
      };
    }
  }

  /**
   * Get CSV metadata
   */
  private async getCsvMetadata(buffer: Buffer, _options?: DocumentOptions): Promise<DocumentMetadata> {
    try {
      const info = this.csvProcessor.getColumnInfo(buffer);

      return {
        format: 'csv',
        pages: undefined,
        custom: {
          rowCount: info.rowCount,
          columnCount: info.columnCount,
          headers: info.headers
        }
      };
    } catch {
      return {
        format: 'csv',
        pages: undefined
      };
    }
  }

  /**
   * Get XLSX metadata
   */
  private async getXlsxMetadata(buffer: Buffer, _options?: DocumentOptions): Promise<DocumentMetadata> {
    if (!this.xlsxProcessor.isAvailable()) {
      return {
        format: 'xlsx',
        pages: undefined
      };
    }

    try {
      const metadata = this.xlsxProcessor.getMetadata(buffer);

      return {
        format: 'xlsx',
        pages: undefined,
        custom: {
          sheetNames: metadata.sheetNames,
          sheetCount: metadata.sheetCount
        }
      };
    } catch {
      return {
        format: 'xlsx',
        pages: undefined
      };
    }
  }

  /**
   * Get OCR processor instance
   */
  getOCRProcessor(): OCRProcessor {
    return this.ocrProcessor;
  }

  /**
   * Get JSON processor instance
   */
  getJsonProcessor(): JsonProcessor {
    return this.jsonProcessor;
  }

  /**
   * Get CSV processor instance
   */
  getCsvProcessor(): CsvProcessor {
    return this.csvProcessor;
  }

  /**
   * Get XLSX processor instance
   */
  getXlsxProcessor(): XlsxProcessor {
    return this.xlsxProcessor;
  }
}

/**
 * Create a document processor instance
 */
export function createDocumentProcessor(): DocumentProcessor {
  return new DocumentProcessor();
}
