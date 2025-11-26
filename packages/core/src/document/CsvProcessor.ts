/**
 * CSV document processor for PII detection and redaction in tabular data
 */

import type { DetectionResult, PIIDetection } from '../types';
import type { OpenRedaction } from '../detector';

/**
 * CSV processing options
 */
export interface CsvProcessorOptions {
  /** CSV delimiter (default: auto-detect from ',', '\t', ';', '|') */
  delimiter?: string;
  /** Whether CSV has header row (default: auto-detect) */
  hasHeader?: boolean;
  /** Quote character (default: '"') */
  quote?: string;
  /** Escape character (default: '"') */
  escape?: string;
  /** Skip empty lines (default: true) */
  skipEmptyLines?: boolean;
  /** Maximum rows to process (default: unlimited) */
  maxRows?: number;
  /** Column indices to always redact (0-indexed) */
  alwaysRedactColumns?: number[];
  /** Column names to always redact (requires hasHeader: true) */
  alwaysRedactColumnNames?: string[];
  /** Column indices to skip scanning (0-indexed) */
  skipColumns?: number[];
  /** Column names that indicate PII (boost confidence) */
  piiIndicatorNames?: string[];
  /** Treat first row as header for detection purposes */
  treatFirstRowAsHeader?: boolean;
}

/**
 * CSV detection result with column tracking
 */
export interface CsvDetectionResult extends DetectionResult {
  /** Total rows processed */
  rowCount: number;
  /** Column count */
  columnCount: number;
  /** Column headers (if detected) */
  headers?: string[];
  /** PII statistics by column index */
  columnStats: Record<number, ColumnStats>;
  /** PII matches by row and column */
  matchesByCell: CellMatch[];
  /** Original text */
  original: string;
  /** Redacted text */
  redacted: string;
  /** Array of detections */
  detections: PIIDetection[];
  /** Redaction map */
  redactionMap: Record<string, string>;
  /** Statistics */
  stats?: {
    processingTime?: number;
    piiCount: number;
  };
}

/**
 * Column PII statistics
 */
export interface ColumnStats {
  /** Column index */
  columnIndex: number;
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
  /** Row index (0-indexed, excluding header if present) */
  row: number;
  /** Column index (0-indexed) */
  column: number;
  /** Column name (if header available) */
  columnName?: string;
  /** Cell value */
  value: string;
  /** PII matches in this cell */
  matches: PIIDetection[];
}

/**
 * Parsed CSV row
 */
interface CsvRow {
  /** Row index */
  index: number;
  /** Cell values */
  values: string[];
}

/**
 * CSV processor for tabular data
 */
export class CsvProcessor {
  private readonly defaultOptions: Required<Omit<CsvProcessorOptions, 'delimiter' | 'hasHeader' | 'maxRows' | 'alwaysRedactColumns' | 'alwaysRedactColumnNames' | 'skipColumns'>> & Partial<Pick<CsvProcessorOptions, 'delimiter' | 'hasHeader' | 'maxRows' | 'alwaysRedactColumns' | 'alwaysRedactColumnNames' | 'skipColumns'>> = {
    quote: '"',
    escape: '"',
    skipEmptyLines: true,
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
    treatFirstRowAsHeader: true
  };

  /**
   * Parse CSV from buffer or string
   */
  parse(input: Buffer | string, options?: CsvProcessorOptions): CsvRow[] {
    const opts = { ...this.defaultOptions, ...options };
    const text = typeof input === 'string' ? input : input.toString('utf-8');

    // Auto-detect delimiter if not specified
    const delimiter = opts.delimiter || this.detectDelimiter(text);

    // Parse CSV
    const lines = text.split(/\r?\n/);
    const rows: CsvRow[] = [];
    let rowIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines if configured
      if (opts.skipEmptyLines && line.trim().length === 0) {
        continue;
      }

      // Check max rows limit
      if (opts.maxRows !== undefined && rowIndex >= opts.maxRows) {
        break;
      }

      // Parse row
      const values = this.parseRow(line, delimiter, opts.quote, opts.escape);

      rows.push({
        index: rowIndex,
        values
      });

      rowIndex++;
    }

    return rows;
  }

  /**
   * Detect PII in CSV data
   */
  detect(
    input: Buffer | string,
    detector: OpenRedaction,
    options?: CsvProcessorOptions
  ): CsvDetectionResult {
    const opts = { ...this.defaultOptions, ...options };
    const rows = this.parse(input, options);

    if (rows.length === 0) {
      const original = typeof input === 'string' ? input : input.toString('utf-8');
      return {
        original,
        redacted: original,
        detections: [],
        redactionMap: {},
        stats: {
          piiCount: 0
        },
        rowCount: 0,
        columnCount: 0,
        columnStats: {},
        matchesByCell: []
      };
    }

    // Determine if first row is header
    const hasHeader = opts.hasHeader !== undefined
      ? opts.hasHeader
      : this.detectHeader(rows);

    const headers = hasHeader && rows.length > 0 ? rows[0].values : undefined;
    const dataRows = hasHeader ? rows.slice(1) : rows;
    const columnCount = rows[0].values.length;

    // Build column name to index map
    const columnNameToIndex = new Map<string, number>();
    if (headers) {
      headers.forEach((header, index) => {
        columnNameToIndex.set(header.toLowerCase().trim(), index);
      });
    }

    // Determine which columns to always redact
    const alwaysRedactCols = new Set<number>(opts.alwaysRedactColumns || []);
    if (opts.alwaysRedactColumnNames && headers) {
      opts.alwaysRedactColumnNames.forEach(name => {
        const index = columnNameToIndex.get(name.toLowerCase().trim());
        if (index !== undefined) {
          alwaysRedactCols.add(index);
        }
      });
    }

    // Determine which columns to skip
    const skipCols = new Set<number>(opts.skipColumns || []);

    // Track statistics
    const columnStats: Record<number, ColumnStats> = {};
    const matchesByCell: CellMatch[] = [];
    const allDetections: PIIDetection[] = [];

    // Initialize column stats
    for (let col = 0; col < columnCount; col++) {
      columnStats[col] = {
        columnIndex: col,
        columnName: headers?.[col],
        piiCount: 0,
        piiPercentage: 0,
        piiTypes: []
      };
    }

    // Scan data rows
    for (const row of dataRows) {
      for (let col = 0; col < row.values.length; col++) {
        // Skip if column should be skipped
        if (skipCols.has(col)) {
          continue;
        }

        const cellValue = row.values[col];

        // Always redact this column?
        if (alwaysRedactCols.has(col)) {
          const detection: PIIDetection = {
            type: 'SENSITIVE_COLUMN',
            value: cellValue,
            placeholder: `[SENSITIVE_COLUMN_${col}]`,
            position: [0, cellValue.length],
            severity: 'high',
            confidence: 1.0
          };

          matchesByCell.push({
            row: row.index,
            column: col,
            columnName: headers?.[col],
            value: cellValue,
            matches: [detection]
          });

          allDetections.push(detection);
          columnStats[col].piiCount++;
          continue;
        }

        // Detect PII
        const result = detector.detect(cellValue);

        if (result.detections.length > 0) {
          // Boost confidence if column name indicates PII
          const boostedDetections = this.boostConfidenceFromColumnName(
            result.detections,
            headers?.[col],
            opts.piiIndicatorNames || []
          );

          matchesByCell.push({
            row: row.index,
            column: col,
            columnName: headers?.[col],
            value: cellValue,
            matches: boostedDetections
          });

          allDetections.push(...boostedDetections);
          columnStats[col].piiCount += boostedDetections.length;

          // Track PII types by column
          const columnTypes = new Set(columnStats[col].piiTypes);
          boostedDetections.forEach(d => columnTypes.add(d.type));
          columnStats[col].piiTypes = Array.from(columnTypes);
        }
      }
    }

    // Calculate column PII percentages
    for (let col = 0; col < columnCount; col++) {
      const rowsWithPii = matchesByCell.filter(m => m.column === col).length;
      columnStats[col].piiPercentage = dataRows.length > 0
        ? (rowsWithPii / dataRows.length) * 100
        : 0;
    }

    // Build redacted text
    const original = typeof input === 'string' ? input : input.toString('utf-8');
    const redacted = this.redact(original, {
      original,
      redacted: original,
      detections: allDetections,
      redactionMap: {},
      stats: { piiCount: allDetections.length },
      rowCount: dataRows.length,
      columnCount,
      headers,
      columnStats,
      matchesByCell
    } as CsvDetectionResult, opts);

    // Build redaction map
    const redactionMap: Record<string, string> = {};
    allDetections.forEach((det) => {
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
      rowCount: dataRows.length,
      columnCount,
      headers: headers?.filter((h): h is string => h !== undefined),
      columnStats,
      matchesByCell
    };
  }

  /**
   * Redact PII in CSV data
   */
  redact(
    input: Buffer | string,
    detectionResult: CsvDetectionResult,
    options?: CsvProcessorOptions
  ): string {
    const opts = { ...this.defaultOptions, ...options };
    const rows = this.parse(input, options);

    if (rows.length === 0) {
      return '';
    }

    const delimiter = opts.delimiter || this.detectDelimiter(
      typeof input === 'string' ? input : input.toString('utf-8')
    );

    const hasHeader = detectionResult.headers !== undefined;

    // Build redaction map: row -> column -> redacted value
    const redactionMap = new Map<number, Map<number, string>>();

    for (const cellMatch of detectionResult.matchesByCell) {
      if (!redactionMap.has(cellMatch.row)) {
        redactionMap.set(cellMatch.row, new Map());
      }
      redactionMap.get(cellMatch.row)!.set(
        cellMatch.column,
        '[REDACTED]'
      );
    }

    // Build redacted CSV
    const outputRows: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const isHeaderRow = hasHeader && i === 0;

      if (isHeaderRow) {
        // Don't redact header row
        outputRows.push(this.formatRow(row.values, delimiter, opts.quote));
      } else {
        // Apply redactions to data row
        const rowIndex = hasHeader ? i - 1 : i;
        const redactedValues = row.values.map((value, colIndex) => {
          return redactionMap.get(rowIndex)?.get(colIndex) || value;
        });
        outputRows.push(this.formatRow(redactedValues, delimiter, opts.quote));
      }
    }

    return outputRows.join('\n');
  }

  /**
   * Parse a single CSV row
   */
  private parseRow(
    line: string,
    delimiter: string,
    quote: string,
    _escape: string
  ): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === quote) {
        if (inQuotes && nextChar === quote) {
          // Escaped quote
          current += quote;
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        // End of field
        values.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // Add last field
    values.push(current);

    return values;
  }

  /**
   * Format a row as CSV
   */
  private formatRow(values: string[], delimiter: string, quote: string): string {
    return values.map(value => {
      // Quote if contains delimiter, quote, or newline
      if (value.includes(delimiter) || value.includes(quote) || value.includes('\n')) {
        // Escape quotes
        const escaped = value.replace(new RegExp(quote, 'g'), quote + quote);
        return `${quote}${escaped}${quote}`;
      }
      return value;
    }).join(delimiter);
  }

  /**
   * Auto-detect CSV delimiter
   */
  private detectDelimiter(text: string): string {
    const delimiters = [',', '\t', ';', '|'];
    const lines = text.split(/\r?\n/).slice(0, 5); // Check first 5 lines

    let bestDelimiter = ',';
    let bestScore = 0;

    for (const delimiter of delimiters) {
      const counts = lines.map(line => {
        // Count non-quoted occurrences
        let count = 0;
        let inQuotes = false;
        for (const char of line) {
          if (char === '"') inQuotes = !inQuotes;
          if (char === delimiter && !inQuotes) count++;
        }
        return count;
      });

      // Good delimiter has consistent count across lines
      if (counts.length > 0 && counts[0] > 0) {
        const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
        const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;

        // Score: high count, low variance
        const score = avg / (variance + 1);
        if (score > bestScore) {
          bestScore = score;
          bestDelimiter = delimiter;
        }
      }
    }

    return bestDelimiter;
  }

  /**
   * Detect if first row is likely a header
   */
  private detectHeader(rows: CsvRow[]): boolean {
    if (rows.length < 2) {
      return false; // Need at least 2 rows to compare
    }

    const firstRow = rows[0].values;
    const secondRow = rows[1].values;

    // Check if first row values are shorter and more text-like
    const firstRowAvgLen = firstRow.reduce((sum, v) => sum + v.length, 0) / firstRow.length;
    const secondRowAvgLen = secondRow.reduce((sum, v) => sum + v.length, 0) / secondRow.length;

    // Headers tend to be shorter
    if (firstRowAvgLen > secondRowAvgLen * 1.5) {
      return false;
    }

    // Check if first row contains mostly text (not numbers)
    const firstRowNumeric = firstRow.filter(v => !isNaN(Number(v)) && v.trim() !== '').length;
    const firstRowNonNumeric = firstRow.length - firstRowNumeric;

    return firstRowNonNumeric >= firstRowNumeric;
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
  extractText(input: Buffer | string, options?: CsvProcessorOptions): string {
    const rows = this.parse(input, options);
    const textParts: string[] = [];

    for (const row of rows) {
      for (const value of row.values) {
        if (value.trim().length > 0) {
          textParts.push(value);
        }
      }
    }

    return textParts.join(' ');
  }

  /**
   * Get column statistics without full PII detection
   */
  getColumnInfo(input: Buffer | string, options?: CsvProcessorOptions): {
    columnCount: number;
    rowCount: number;
    headers?: string[];
    sampleRows: string[][];
  } {
    const rows = this.parse(input, options);

    if (rows.length === 0) {
      return {
        columnCount: 0,
        rowCount: 0,
        sampleRows: []
      };
    }

    const opts = { ...this.defaultOptions, ...options };
    const hasHeader = opts.hasHeader !== undefined
      ? opts.hasHeader
      : this.detectHeader(rows);

    const headers = hasHeader && rows.length > 0 ? rows[0].values : undefined;
    const dataRows = hasHeader ? rows.slice(1) : rows;
    const sampleRows = dataRows.slice(0, 5).map(r => r.values);

    return {
      columnCount: rows[0].values.length,
      rowCount: dataRows.length,
      headers,
      sampleRows
    };
  }
}

/**
 * Create a CSV processor instance
 */
export function createCsvProcessor(): CsvProcessor {
  return new CsvProcessor();
}
