/**
 * Document text extraction with optional peer dependencies
 */

import type {
  IDocumentProcessor,
  DocumentFormat,
  DocumentOptions,
  DocumentMetadata
} from './types';

/**
 * Document processor with optional PDF and DOCX support
 * Requires peer dependencies: pdf-parse (for PDF), mammoth (for DOCX)
 */
export class DocumentProcessor implements IDocumentProcessor {
  private pdfParse?: any;
  private mammoth?: any;

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
  }

  /**
   * Extract text from document buffer
   */
  async extractText(buffer: Buffer, options?: DocumentOptions): Promise<string> {
    const format = options?.format || this.detectFormat(buffer);

    if (!format) {
      throw new Error('[DocumentProcessor] Unable to detect document format. Supported: PDF, DOCX, TXT');
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
      default:
        throw new Error(`[DocumentProcessor] Unsupported format: ${format}`);
    }
  }

  /**
   * Detect document format from buffer
   */
  detectFormat(buffer: Buffer): DocumentFormat | null {
    // PDF: starts with %PDF
    if (buffer.length >= 4 && buffer.toString('utf-8', 0, 4) === '%PDF') {
      return 'pdf';
    }

    // DOCX: ZIP file starting with PK (Word docs are ZIP archives)
    if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B) {
      // Check for [Content_Types].xml which is specific to Office Open XML
      const zipHeader = buffer.toString('utf-8', 0, Math.min(500, buffer.length));
      if (zipHeader.includes('word/') || zipHeader.includes('[Content_Types].xml')) {
        return 'docx';
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
}

/**
 * Create a document processor instance
 */
export function createDocumentProcessor(): DocumentProcessor {
  return new DocumentProcessor();
}
