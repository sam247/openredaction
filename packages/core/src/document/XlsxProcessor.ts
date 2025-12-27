/**
 * XLSX/Excel document processor for PII detection and redaction in spreadsheets
 */

import type { DetectionResult, PIIDetection } from '../types';
import type { OpenRedaction } from '../detector';

/**
 * XLSX processing options
 */
export interface XlsxProcessorOptions {
  /** Sheet names to process (default: all sheets) */
  sheets?: string[];
  /** Sheet indices to process (0-indexed, default: all sheets) */
  sheetIndices?: number[];
  /** Whether to treat first row as header (default: auto-detect) */
  hasHeader?: boolean;
  /** Maximum rows per sheet to process (default: unlimited) */
  maxRows?: number;
  /** Column indices to always redact (0-indexed) */
  alwaysRedactColumns?: number[];
  /** Column names to always redact (requires hasHeader: true) */
  alwaysRedactColumnNames?: string[];
  /** Column indices to skip scanning (0-indexed) */
  skipColumns?: number[];
  /** Column names that indicate PII (boost confidence) */
  piiIndicatorNames?: string[];
  /** Preserve cell formatting (default: true) */
  preserveFormatting?: boolean;
  /** Preserve formulas (default: true, redact values but keep formula) */
  preserveFormulas?: boolean;
}

/**
 * XLSX detection result with sheet and cell tracking
 */
export interface XlsxDetectionResult extends DetectionResult {
  /** Results by sheet */
  sheetResults: SheetDetectionResult[];
  /** Total sheets processed */
  sheetCount: number;
}

/**
 * Sheet-level detection result
 */
export interface SheetDetectionResult {
  /** Sheet name */
  sheetName: string;
  /** Sheet index */
  sheetIndex: number;
  /** Total rows in sheet */
  rowCount: number;
  /** Column count */
  columnCount: number;
  /** Column headers (if detected) */
  headers?: string[];
  /** Column statistics */
  columnStats: Record<number, ColumnStats>;
  /** Cell matches */
  matchesByCell: CellMatch[];
}

/**
 * Column PII statistics
 */
export interface ColumnStats {
  /** Column index */
  columnIndex: number;
  /** Column letter (A, B, C, etc.) */
  columnLetter: string;
  /** Column name (if header available) */
  columnName?: string;
  /** Number of PII instances found */
  piiCount: number;
  /** Percentage of rows with PII (0-100) */
  piiPercentage: number;
  /** PII types found in this column */
  piiTypes: string[];
}

/**
 * Cell-level PII match
 */
export interface CellMatch {
  /** Cell reference (e.g., 'A1', 'B5') */
  cell: string;
  /** Row index (1-indexed, Excel style) */
  row: number;
  /** Column index (0-indexed) */
  column: number;
  /** Column letter */
  columnLetter: string;
  /** Column name (if header available) */
  columnName?: string;
  /** Cell value */
  value: string;
  /** Cell formula (if any) */
  formula?: string;
  /** PII matches in this cell */
  matches: PIIDetection[];
}

/**
 * XLSX processor for spreadsheet data
 */
export class XlsxProcessor {
  private xlsx?: any;

  private readonly defaultOptions: Required<Omit<XlsxProcessorOptions, 'sheets' | 'sheetIndices' | 'maxRows' | 'alwaysRedactColumns' | 'alwaysRedactColumnNames' | 'skipColumns' | 'hasHeader'>> & Partial<Pick<XlsxProcessorOptions, 'sheets' | 'sheetIndices' | 'maxRows' | 'alwaysRedactColumns' | 'alwaysRedactColumnNames' | 'skipColumns' | 'hasHeader'>> = {
    piiIndicatorNames: [
      'email', 'e-mail', 'mail', 'email_address',
      'phone', 'tel', 'telephone', 'mobile', 'phone_number',
      'ssn', 'social_security', 'social_security_number',
      'address', 'street', 'street_address', 'city', 'zip', 'zipcode', 'postal', 'postcode',
      'name', 'firstname', 'first_name', 'lastname', 'last_name', 'fullname', 'full_name',
      'password', 'pwd', 'secret', 'token', 'api_key',
      'card', 'credit_card', 'creditcard', 'card_number',
      'account', 'account_number', 'iban', 'swift',
      'passport', 'passport_number', 'license', 'licence', 'driver_license',
      'dob', 'date_of_birth', 'birth_date', 'birthdate'
    ],
    preserveFormatting: true,
    preserveFormulas: true
  };

  constructor() {
    // Try to load xlsx dependency
    try {
      this.xlsx = require('xlsx');
    } catch {
      // xlsx not installed
    }
  }

  /**
   * Check if XLSX support is available
   */
  isAvailable(): boolean {
    return !!this.xlsx;
  }

  /**
   * Parse XLSX from buffer
   */
  parse(buffer: Buffer): any {
    if (!this.xlsx) {
      throw new Error(
        '[XlsxProcessor] XLSX support requires xlsx package. Install with: npm install xlsx'
      );
    }

    try {
      return this.xlsx.read(buffer, { type: 'buffer', cellFormula: true, cellStyles: true });
    } catch (error: any) {
      throw new Error(`[XlsxProcessor] Failed to parse XLSX: ${error.message}`);
    }
  }

  /**
   * Detect PII in XLSX data
   */
  async detect(
    buffer: Buffer,
    detector: OpenRedaction,
    options?: XlsxProcessorOptions
  ): Promise<XlsxDetectionResult> {
    if (!this.xlsx) {
      throw new Error(
        '[XlsxProcessor] XLSX support requires xlsx package. Install with: npm install xlsx'
      );
    }

    const opts = { ...this.defaultOptions, ...options };
    const workbook = this.parse(buffer);

    // Determine which sheets to process
    const sheetNames = this.getSheetNamesToProcess(workbook, opts);

    const sheetResults: SheetDetectionResult[] = [];
    const allDetections: PIIDetection[] = [];
    const allTypes = new Set<string>();

    for (let sheetIndex = 0; sheetIndex < sheetNames.length; sheetIndex++) {
      const sheetName = sheetNames[sheetIndex];
      const sheet = workbook.Sheets[sheetName];

      const sheetResult = await this.detectSheet(
        sheet,
        sheetName,
        sheetIndex,
        detector,
        opts
      );

      sheetResults.push(sheetResult);
      allDetections.push(...sheetResult.matchesByCell.flatMap(c => c.matches));
      sheetResult.matchesByCell.forEach(cell => {
        cell.matches.forEach(det => allTypes.add(det.type));
      });
    }

    const original = this.extractText(buffer, options);
    const redactedBuffer = this.redact(buffer, {
      original,
      redacted: original,
      detections: allDetections,
      redactionMap: {},
      stats: { piiCount: allDetections.length },
      sheetResults,
      sheetCount: sheetResults.length
    } as XlsxDetectionResult, options);
    const redacted = this.extractText(redactedBuffer, options);

    const redactionMap: Record<string, string> = {};
    allDetections.forEach(det => {
      redactionMap[det.placeholder] = det.value;
    });

    return {
      original,
      redacted,
      detections: allDetections,
      redactionMap,
      stats: {
        piiCount: allDetections.length
      },
      sheetResults,
      sheetCount: sheetResults.length
    };
  }

  /**
   * Detect PII in a single sheet
   */
  private async detectSheet(
    sheet: any,
    sheetName: string,
    sheetIndex: number,
    detector: OpenRedaction,
    options: Required<Omit<XlsxProcessorOptions, 'sheets' | 'sheetIndices' | 'maxRows' | 'alwaysRedactColumns' | 'alwaysRedactColumnNames' | 'skipColumns' | 'hasHeader'>> & Partial<Pick<XlsxProcessorOptions, 'sheets' | 'sheetIndices' | 'maxRows' | 'alwaysRedactColumns' | 'alwaysRedactColumnNames' | 'skipColumns' | 'hasHeader'>>
  ): Promise<SheetDetectionResult> {
    // Get sheet range
    const range = this.xlsx.utils.decode_range(sheet['!ref'] || 'A1');
    const startRow = range.s.r;
    const endRow = options.maxRows !== undefined
      ? Math.min(range.e.r, startRow + options.maxRows - 1)
      : range.e.r;
    const startCol = range.s.c;
    const endCol = range.e.c;

    const columnCount = endCol - startCol + 1;

    // Detect header
    const hasHeader = options.hasHeader !== undefined
      ? options.hasHeader
      : this.detectHeader(sheet, range);

    const headers = hasHeader
      ? this.getRowValues(sheet, startRow, startCol, endCol)
      : undefined;

    const dataStartRow = hasHeader ? startRow + 1 : startRow;

    // Build column name to index map
    const columnNameToIndex = new Map<string, number>();
    if (headers) {
      headers.forEach((header, index) => {
        if (header) {
          columnNameToIndex.set(header.toLowerCase().trim(), index);
        }
      });
    }

    // Determine which columns to always redact
    const alwaysRedactCols = new Set<number>(options.alwaysRedactColumns || []);
    if (options.alwaysRedactColumnNames && headers) {
      options.alwaysRedactColumnNames.forEach(name => {
        const index = columnNameToIndex.get(name.toLowerCase().trim());
        if (index !== undefined) {
          alwaysRedactCols.add(index);
        }
      });
    }

    // Determine which columns to skip
    const skipCols = new Set<number>(options.skipColumns || []);

    // Initialize column stats
    const columnStats: Record<number, ColumnStats> = {};
    for (let col = 0; col <= endCol - startCol; col++) {
      columnStats[col] = {
        columnIndex: col,
        columnLetter: this.columnToLetter(col),
        columnName: headers?.[col],
        piiCount: 0,
        piiPercentage: 0,
        piiTypes: []
      };
    }

    const matchesByCell: CellMatch[] = [];

    // Scan data rows
    for (let row = dataStartRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const colIndex = col - startCol;

        // Skip if column should be skipped
        if (skipCols.has(colIndex)) {
          continue;
        }

        const cellRef = this.xlsx.utils.encode_cell({ r: row, c: col });
        const cell = sheet[cellRef];

        if (!cell) continue;

        const cellValue = this.getCellValue(cell);
        if (!cellValue) continue;

        const cellFormula = cell.f;

        // Always redact this column?
        if (alwaysRedactCols.has(colIndex)) {
          const detection: PIIDetection = {
            type: 'SENSITIVE_COLUMN',
            value: cellValue,
            placeholder: `[SENSITIVE_COLUMN_${colIndex}]`,
            position: [0, cellValue.length],
            severity: 'high',
            confidence: 1.0
          };

          matchesByCell.push({
            cell: cellRef,
            row: row + 1, // 1-indexed for Excel
            column: colIndex,
            columnLetter: this.columnToLetter(colIndex),
            columnName: headers?.[colIndex],
            value: cellValue,
            formula: cellFormula,
            matches: [detection]
          });

          columnStats[colIndex].piiCount++;
          continue;
        }

        // Detect PII
        const result = await detector.detect(cellValue);

        if (result.detections.length > 0) {
          // Boost confidence if column name indicates PII
          const boostedDetections = this.boostConfidenceFromColumnName(
            result.detections,
            headers?.[colIndex],
            options.piiIndicatorNames || []
          );

          matchesByCell.push({
            cell: cellRef,
            row: row + 1, // 1-indexed for Excel
            column: colIndex,
            columnLetter: this.columnToLetter(colIndex),
            columnName: headers?.[colIndex],
            value: cellValue,
            formula: cellFormula,
            matches: boostedDetections
          });

          columnStats[colIndex].piiCount += boostedDetections.length;

          // Track PII types by column
          const columnTypes = new Set(columnStats[colIndex].piiTypes);
          boostedDetections.forEach(d => columnTypes.add(d.type));
          columnStats[colIndex].piiTypes = Array.from(columnTypes);
        }
      }
    }

    // Calculate column PII percentages
    const dataRowCount = endRow - dataStartRow + 1;
    for (let col = 0; col <= endCol - startCol; col++) {
      const rowsWithPii = matchesByCell.filter(m => m.column === col).length;
      columnStats[col].piiPercentage = dataRowCount > 0
        ? (rowsWithPii / dataRowCount) * 100
        : 0;
    }

    return {
      sheetName,
      sheetIndex,
      rowCount: dataRowCount,
      columnCount,
      headers: headers?.filter((h): h is string => h !== undefined),
      columnStats,
      matchesByCell
    };
  }

  /**
   * Redact PII in XLSX data
   */
  redact(
    buffer: Buffer,
    detectionResult: XlsxDetectionResult,
    options?: XlsxProcessorOptions
  ): Buffer {
    if (!this.xlsx) {
      throw new Error(
        '[XlsxProcessor] XLSX support requires xlsx package. Install with: npm install xlsx'
      );
    }

    const opts = { ...this.defaultOptions, ...options };
    const workbook = this.parse(buffer);

    // Apply redactions for each sheet
    for (const sheetResult of detectionResult.sheetResults) {
      const sheet = workbook.Sheets[sheetResult.sheetName];

      for (const cellMatch of sheetResult.matchesByCell) {
        const cellRef = cellMatch.cell;
        const cell = sheet[cellRef];

        if (!cell) continue;

        // Redact value
        cell.v = '[REDACTED]';
        cell.w = '[REDACTED]';

        // Preserve formula if configured
        if (!opts.preserveFormulas) {
          delete cell.f;
        }

        // Update cell type to string
        cell.t = 's';
      }
    }

    // Write back to buffer
    return this.xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Get cell value as string
   */
  private getCellValue(cell: any): string {
    if (!cell) return '';

    // Try formatted value first
    if (cell.w !== undefined) {
      return String(cell.w);
    }

    // Fall back to raw value
    if (cell.v !== undefined) {
      return String(cell.v);
    }

    return '';
  }

  /**
   * Get row values
   */
  private getRowValues(sheet: any, row: number, startCol: number, endCol: number): (string | undefined)[] {
    const values: (string | undefined)[] = [];

    for (let col = startCol; col <= endCol; col++) {
      const cellRef = this.xlsx.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellRef];
      values.push(cell ? this.getCellValue(cell) : undefined);
    }

    return values;
  }

  /**
   * Detect if first row is likely a header
   */
  private detectHeader(sheet: any, range: any): boolean {
    const firstRow = this.getRowValues(sheet, range.s.r, range.s.c, range.e.c);
    const secondRow = range.s.r + 1 <= range.e.r
      ? this.getRowValues(sheet, range.s.r + 1, range.s.c, range.e.c)
      : null;

    if (!secondRow) return false;

    // Check if first row values are shorter and more text-like
    const firstRowValues = firstRow.filter(v => v !== undefined) as string[];
    const secondRowValues = secondRow.filter(v => v !== undefined) as string[];

    if (firstRowValues.length === 0 || secondRowValues.length === 0) {
      return false;
    }

    const firstRowAvgLen = firstRowValues.reduce((sum, v) => sum + v.length, 0) / firstRowValues.length;
    const secondRowAvgLen = secondRowValues.reduce((sum, v) => sum + v.length, 0) / secondRowValues.length;

    // Headers tend to be shorter
    if (firstRowAvgLen > secondRowAvgLen * 1.5) {
      return false;
    }

    // Check if first row contains mostly text (not numbers)
    const firstRowNumeric = firstRowValues.filter(v => !isNaN(Number(v)) && v.trim() !== '').length;
    const firstRowNonNumeric = firstRowValues.length - firstRowNumeric;

    return firstRowNonNumeric >= firstRowNumeric;
  }

  /**
   * Convert column index to letter (0 = A, 25 = Z, 26 = AA)
   */
  private columnToLetter(col: number): string {
    let letter = '';
    while (col >= 0) {
      letter = String.fromCharCode((col % 26) + 65) + letter;
      col = Math.floor(col / 26) - 1;
    }
    return letter;
  }

  /**
   * Get sheet names to process based on options
   */
  private getSheetNamesToProcess(workbook: any, options: Partial<XlsxProcessorOptions>): string[] {
    const allSheetNames = workbook.SheetNames;

    // If specific sheets requested by name
    if (options.sheets && options.sheets.length > 0) {
      return options.sheets.filter(name => allSheetNames.includes(name));
    }

    // If specific sheets requested by index
    if (options.sheetIndices && options.sheetIndices.length > 0) {
      return options.sheetIndices
        .filter(index => index >= 0 && index < allSheetNames.length)
        .map(index => allSheetNames[index]);
    }

    // Process all sheets
    return allSheetNames;
  }

  /**
   * Boost confidence if column name indicates PII
   */
  private boostConfidenceFromColumnName(
    detections: PIIDetection[],
    columnName: string | undefined,
    piiIndicatorNames: string[]
  ): PIIDetection[] {
    if (!columnName) return detections;

    const nameLower = columnName.toLowerCase().trim();
    const isPiiColumn = piiIndicatorNames.some(indicator =>
      nameLower.includes(indicator.toLowerCase())
    );

    if (!isPiiColumn) return detections;

    // Boost confidence by 20% (capped at 1.0)
    return detections.map(detection => ({
      ...detection,
      confidence: Math.min(1.0, (detection.confidence || 0.5) * 1.2)
    }));
  }

  /**
   * Extract all cell values as text
   */
  extractText(buffer: Buffer, options?: XlsxProcessorOptions): string {
    if (!this.xlsx) {
      throw new Error(
        '[XlsxProcessor] XLSX support requires xlsx package. Install with: npm install xlsx'
      );
    }

    const workbook = this.parse(buffer);
    const opts = { ...this.defaultOptions, ...options };
    const sheetNames = this.getSheetNamesToProcess(workbook, opts);

    const textParts: string[] = [];

    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const range = this.xlsx.utils.decode_range(sheet['!ref'] || 'A1');

      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = this.xlsx.utils.encode_cell({ r: row, c: col });
          const cell = sheet[cellRef];

          if (cell) {
            const value = this.getCellValue(cell);
            if (value.trim().length > 0) {
              textParts.push(value);
            }
          }
        }
      }
    }

    return textParts.join(' ');
  }

  /**
   * Get workbook metadata
   */
  getMetadata(buffer: Buffer): {
    sheetNames: string[];
    sheetCount: number;
  } {
    if (!this.xlsx) {
      throw new Error(
        '[XlsxProcessor] XLSX support requires xlsx package. Install with: npm install xlsx'
      );
    }

    const workbook = this.parse(buffer);

    return {
      sheetNames: workbook.SheetNames,
      sheetCount: workbook.SheetNames.length
    };
  }
}

/**
 * Create an XLSX processor instance
 */
export function createXlsxProcessor(): XlsxProcessor {
  return new XlsxProcessor();
}
