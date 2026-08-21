/**
 * Document text extraction with optional peer dependencies
 */

import { errorMessage } from "../utils/errors";
import {
  isModuleAvailable,
  loadOptionalModule,
} from "../utils/optional-require";
import { CsvProcessor } from "./CsvProcessor";
import { JsonProcessor } from "./JsonProcessor";
import { OCRProcessor } from "./OCRProcessor";
import type {
  DocumentFormat,
  DocumentMetadata,
  DocumentOptions,
  IDocumentProcessor,
} from "./types";
import { XlsxProcessor } from "./XlsxProcessor";

type PdfParseModule = typeof import("pdf-parse");
type MammothModule = typeof import("mammoth");

/** @types/pdf-parse omits `password`, which pdf-parse forwards to pdf.js getDocument */
type PdfParseOptions = NonNullable<Parameters<PdfParseModule>[1]> & {
  password?: string;
};

const PDF_INSTALL_HINT =
  "[DocumentProcessor] PDF support requires pdf-parse. Install with: npm install pdf-parse";
const DOCX_INSTALL_HINT =
  "[DocumentProcessor] DOCX support requires mammoth. Install with: npm install mammoth";

/**
 * Document processor with optional PDF, DOCX, OCR, JSON, CSV, and XLSX support
 * Requires peer dependencies (loaded lazily on first use):
 * - pdf-parse (for PDF)
 * - mammoth (for DOCX)
 * - tesseract.js (for OCR/images)
 * - xlsx (for Excel/XLSX)
 */
export class DocumentProcessor implements IDocumentProcessor {
  private pdfParse?: PdfParseModule | null;
  private mammoth?: MammothModule | null;
  private ocrProcessor = new OCRProcessor();
  private jsonProcessor = new JsonProcessor();
  private csvProcessor = new CsvProcessor();
  private xlsxProcessor = new XlsxProcessor();

  private loadPdfParse(): PdfParseModule {
    if (this.pdfParse === undefined) {
      this.pdfParse = loadOptionalModule<PdfParseModule>("pdf-parse") ?? null;
    }

    if (!this.pdfParse) {
      throw new Error(PDF_INSTALL_HINT);
    }

    return this.pdfParse;
  }

  private loadMammoth(): MammothModule {
    if (this.mammoth === undefined) {
      this.mammoth = loadOptionalModule<MammothModule>("mammoth") ?? null;
    }

    if (!this.mammoth) {
      throw new Error(DOCX_INSTALL_HINT);
    }

    return this.mammoth;
  }

  /**
   * Extract text from document buffer
   */
  async extractText(
    buffer: Buffer,
    options?: DocumentOptions,
  ): Promise<string> {
    const format = options?.format || this.detectFormat(buffer);

    if (!format) {
      throw new Error(
        "[DocumentProcessor] Unable to detect document format. Supported: PDF, DOCX, TXT, images (with OCR)",
      );
    }

    // Check size limit
    const maxSize = options?.maxSize || 50 * 1024 * 1024; // 50MB default
    if (buffer.length > maxSize) {
      throw new Error(
        `[DocumentProcessor] Document size (${buffer.length} bytes) exceeds maximum (${maxSize} bytes)`,
      );
    }

    switch (format) {
      case "pdf":
        return this.extractPdfText(buffer, options);
      case "docx":
        return this.extractDocxText(buffer, options);
      case "txt":
        return buffer.toString("utf-8");
      case "image":
        return this.extractImageText(buffer, options);
      case "json":
        return this.extractJsonText(buffer, options);
      case "csv":
        return this.extractCsvText(buffer, options);
      case "xlsx":
        return this.extractXlsxText(buffer, options);
      default:
        throw new Error(`[DocumentProcessor] Unsupported format: ${format}`);
    }
  }

  /**
   * Get document metadata
   */
  async getMetadata(
    buffer: Buffer,
    options?: DocumentOptions,
  ): Promise<DocumentMetadata> {
    const format = options?.format || this.detectFormat(buffer);

    if (!format) {
      throw new Error("[DocumentProcessor] Unable to detect document format");
    }

    switch (format) {
      case "pdf":
        return this.getPdfMetadata(buffer, options);
      case "docx":
        return this.getDocxMetadata(buffer, options);
      case "txt":
        return {
          format: "txt",
          pages: undefined,
        };
      case "image":
        return this.getImageMetadata(buffer, options);
      case "json":
        return this.getJsonMetadata(buffer, options);
      case "csv":
        return this.getCsvMetadata(buffer, options);
      case "xlsx":
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
    if (buffer.toString("utf-8", 0, 4) === "%PDF") {
      return "pdf";
    }

    // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return "image";
    }

    // JPEG: starts with FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return "image";
    }

    // TIFF: starts with 49 49 2A 00 (little-endian) or 4D 4D 00 2A (big-endian)
    if (
      (buffer[0] === 0x49 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x2a &&
        buffer[3] === 0x00) ||
      (buffer[0] === 0x4d &&
        buffer[1] === 0x4d &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x2a)
    ) {
      return "image";
    }

    // BMP: starts with 42 4D
    if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
      return "image";
    }

    // WebP: starts with RIFF followed by WEBP at offset 8
    if (
      buffer.length >= 12 &&
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return "image";
    }

    // DOCX/XLSX: ZIP file starting with PK (Office docs are ZIP archives)
    if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
      // Check for [Content_Types].xml which is specific to Office Open XML
      const zipHeader = buffer.toString(
        "utf-8",
        0,
        Math.min(500, buffer.length),
      );
      if (
        zipHeader.includes("word/") ||
        zipHeader.includes("[Content_Types].xml")
      ) {
        return "docx";
      }
      if (zipHeader.includes("xl/")) {
        return "xlsx";
      }
    }

    // JSON: Try to parse as JSON
    const text = buffer.toString("utf-8");
    const trimmed = text.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      if (this.jsonProcessor.isValid(buffer)) {
        return "json";
      }
    }

    // CSV: Check for delimiter patterns (comma, tab, semicolon, pipe)
    // Look for consistent delimiters across multiple lines
    const lines = text.split(/\r?\n/).slice(0, 5);
    if (lines.length >= 2) {
      const delimiters = [",", "\t", ";", "|"];
      for (const delimiter of delimiters) {
        const counts = lines.map(
          (line) => (line.match(new RegExp(delimiter, "g")) || []).length,
        );
        // If we see consistent delimiter counts > 0, likely CSV
        if (counts[0] > 0 && counts.every((c) => c === counts[0])) {
          return "csv";
        }
      }
    }

    // TXT: assume plain text if no other format detected
    // Check if buffer contains mostly printable ASCII/UTF-8
    const sample = buffer.slice(0, Math.min(1000, buffer.length));
    const nonPrintable = sample.filter(
      (byte) => byte < 32 && byte !== 9 && byte !== 10 && byte !== 13,
    ).length;
    if (nonPrintable < sample.length * 0.1) {
      return "txt";
    }

    return null;
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format: DocumentFormat): boolean {
    switch (format) {
      case "pdf":
        return isModuleAvailable("pdf-parse");
      case "docx":
        return isModuleAvailable("mammoth");
      case "txt":
        return true;
      case "image":
        return this.ocrProcessor.isAvailable();
      case "json":
        return true; // Always supported (native)
      case "csv":
        return true; // Always supported (native)
      case "xlsx":
        return this.xlsxProcessor.isAvailable();
      default:
        return false;
    }
  }

  /**
   * Extract text from PDF
   */
  private async extractPdfText(
    buffer: Buffer,
    options?: DocumentOptions,
  ): Promise<string> {
    const pdfParse = this.loadPdfParse();

    try {
      const parseOptions: PdfParseOptions = {
        password: options?.password,
        max: options?.pages ? Math.max(...options.pages) : undefined,
      };
      const data = await pdfParse(buffer, parseOptions);

      // If specific pages requested, filter them
      if (options?.pages) {
        // pdf-parse doesn't support per-page text extraction easily
        // Return full text for now (enhancement: implement page filtering)
        return data.text;
      }

      return data.text || "";
    } catch (error) {
      throw new Error(
        `[DocumentProcessor] PDF extraction failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Extract text from DOCX
   */
  private async extractDocxText(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<string> {
    const mammoth = this.loadMammoth();

    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    } catch (error) {
      throw new Error(
        `[DocumentProcessor] DOCX extraction failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Get PDF metadata
   */
  private async getPdfMetadata(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<DocumentMetadata> {
    const pdfParse = this.loadPdfParse();

    try {
      const parseOptions: PdfParseOptions = {
        password: _options?.password,
      };
      const data = await pdfParse(buffer, parseOptions);

      return {
        format: "pdf",
        pages: data.numpages,
        title: data.info?.Title,
        author: data.info?.Author,
        creationDate: data.info?.CreationDate
          ? new Date(data.info.CreationDate)
          : undefined,
        modifiedDate: data.info?.ModDate
          ? new Date(data.info.ModDate)
          : undefined,
        custom: data.info,
      };
    } catch (error) {
      throw new Error(
        `[DocumentProcessor] PDF metadata extraction failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Get DOCX metadata
   */
  private async getDocxMetadata(
    _buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<DocumentMetadata> {
    // mammoth doesn't provide metadata extraction
    // Basic metadata only
    return {
      format: "docx",
      pages: undefined, // Word doesn't have fixed pages
    };
  }

  /**
   * Extract text from image using OCR
   */
  private async extractImageText(
    buffer: Buffer,
    options?: DocumentOptions,
  ): Promise<string> {
    if (!this.ocrProcessor.isAvailable()) {
      throw new Error(
        "[DocumentProcessor] Image/OCR support requires tesseract.js. Install with: npm install tesseract.js",
      );
    }

    try {
      const result = await this.ocrProcessor.recognizeText(
        buffer,
        options?.ocrOptions,
      );
      return result.text;
    } catch (error) {
      throw new Error(
        `[DocumentProcessor] Image text extraction failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Get image metadata
   */
  private async getImageMetadata(
    buffer: Buffer,
    options?: DocumentOptions,
  ): Promise<DocumentMetadata> {
    if (!this.ocrProcessor.isAvailable()) {
      return {
        format: "image",
        pages: undefined,
        usedOCR: false,
      };
    }

    try {
      // Run OCR to get confidence
      const result = await this.ocrProcessor.recognizeText(
        buffer,
        options?.ocrOptions,
      );

      return {
        format: "image",
        pages: undefined,
        usedOCR: true,
        ocrConfidence: result.confidence,
      };
    } catch {
      // OCR failed, return basic metadata
      return {
        format: "image",
        pages: undefined,
        usedOCR: false,
      };
    }
  }

  /**
   * Extract text from JSON
   */
  private async extractJsonText(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<string> {
    try {
      return this.jsonProcessor.extractText(buffer);
    } catch (error) {
      throw new Error(
        `[DocumentProcessor] JSON extraction failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Extract text from CSV
   */
  private async extractCsvText(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<string> {
    try {
      return this.csvProcessor.extractText(buffer);
    } catch (error) {
      throw new Error(
        `[DocumentProcessor] CSV extraction failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Extract text from XLSX
   */
  private async extractXlsxText(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<string> {
    if (!this.xlsxProcessor.isAvailable()) {
      throw new Error(
        "[DocumentProcessor] XLSX support requires xlsx package. Install with: npm install xlsx",
      );
    }

    try {
      return this.xlsxProcessor.extractText(buffer);
    } catch (error) {
      throw new Error(
        `[DocumentProcessor] XLSX extraction failed: ${errorMessage(error)}`,
      );
    }
  }

  /**
   * Get JSON metadata
   */
  private async getJsonMetadata(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<DocumentMetadata> {
    try {
      const data = this.jsonProcessor.parse(buffer);
      const isArray = Array.isArray(data);
      const itemCount = isArray
        ? data.length
        : data !== null && typeof data === "object"
          ? Object.keys(data).length
          : 0;

      return {
        format: "json",
        pages: undefined,
        custom: {
          isArray,
          itemCount,
        },
      };
    } catch {
      return {
        format: "json",
        pages: undefined,
      };
    }
  }

  /**
   * Get CSV metadata
   */
  private async getCsvMetadata(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<DocumentMetadata> {
    try {
      const info = this.csvProcessor.getColumnInfo(buffer);

      return {
        format: "csv",
        pages: undefined,
        custom: {
          rowCount: info.rowCount,
          columnCount: info.columnCount,
          headers: info.headers,
        },
      };
    } catch {
      return {
        format: "csv",
        pages: undefined,
      };
    }
  }

  /**
   * Get XLSX metadata
   */
  private async getXlsxMetadata(
    buffer: Buffer,
    _options?: DocumentOptions,
  ): Promise<DocumentMetadata> {
    if (!this.xlsxProcessor.isAvailable()) {
      return {
        format: "xlsx",
        pages: undefined,
      };
    }

    try {
      const metadata = this.xlsxProcessor.getMetadata(buffer);

      return {
        format: "xlsx",
        pages: undefined,
        custom: {
          sheetNames: metadata.sheetNames,
          sheetCount: metadata.sheetCount,
        },
      };
    } catch {
      return {
        format: "xlsx",
        pages: undefined,
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
