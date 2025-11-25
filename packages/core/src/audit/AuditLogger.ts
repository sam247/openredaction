/**
 * Audit logging implementation for tracking redaction operations
 */

import type { IAuditLogger, AuditLogEntry, AuditStats } from '../types';

/**
 * In-memory audit logger implementation
 * Stores audit logs in memory with support for filtering, export, and statistics
 */
export class InMemoryAuditLogger implements IAuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs: number;

  constructor(maxLogs: number = 10000) {
    this.maxLogs = maxLogs;
  }

  /**
   * Log an audit entry
   */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    };

    this.logs.push(auditEntry);

    // Maintain max log size (FIFO)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get all audit logs
   */
  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get audit logs filtered by operation type
   */
  getLogsByOperation(operation: AuditLogEntry['operation']): AuditLogEntry[] {
    return this.logs.filter(log => log.operation === operation);
  }

  /**
   * Get audit logs filtered by date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= startTime && logTime <= endTime;
    });
  }

  /**
   * Export audit logs as JSON
   */
  exportAsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Export audit logs as CSV
   */
  exportAsCsv(): string {
    if (this.logs.length === 0) {
      return 'id,timestamp,operation,piiCount,piiTypes,textLength,processingTimeMs,redactionMode,success,error,user,sessionId\n';
    }

    const headers = [
      'id',
      'timestamp',
      'operation',
      'piiCount',
      'piiTypes',
      'textLength',
      'processingTimeMs',
      'redactionMode',
      'success',
      'error',
      'user',
      'sessionId'
    ];

    const rows = this.logs.map(log => {
      return [
        this.escapeCsv(log.id),
        this.escapeCsv(log.timestamp),
        this.escapeCsv(log.operation),
        log.piiCount.toString(),
        this.escapeCsv(log.piiTypes.join(';')),
        log.textLength.toString(),
        log.processingTimeMs.toFixed(2),
        this.escapeCsv(log.redactionMode || ''),
        log.success.toString(),
        this.escapeCsv(log.error || ''),
        this.escapeCsv(log.user || ''),
        this.escapeCsv(log.sessionId || '')
      ].join(',');
    });

    return headers.join(',') + '\n' + rows.join('\n');
  }

  /**
   * Clear all audit logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Get audit statistics
   */
  getStats(): AuditStats {
    if (this.logs.length === 0) {
      return {
        totalOperations: 0,
        totalPiiDetected: 0,
        averageProcessingTime: 0,
        topPiiTypes: [],
        operationsByType: {},
        successRate: 0
      };
    }

    const totalOperations = this.logs.length;
    const totalPiiDetected = this.logs.reduce((sum, log) => sum + log.piiCount, 0);
    const totalProcessingTime = this.logs.reduce((sum, log) => sum + log.processingTimeMs, 0);
    const averageProcessingTime = totalProcessingTime / totalOperations;
    const successCount = this.logs.filter(log => log.success).length;
    const successRate = successCount / totalOperations;

    // Count PII types
    const piiTypeCount = new Map<string, number>();
    this.logs.forEach(log => {
      log.piiTypes.forEach(type => {
        piiTypeCount.set(type, (piiTypeCount.get(type) || 0) + 1);
      });
    });

    // Sort and get top PII types
    const topPiiTypes = Array.from(piiTypeCount.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count operations by type
    const operationsByType: Record<string, number> = {};
    this.logs.forEach(log => {
      operationsByType[log.operation] = (operationsByType[log.operation] || 0) + 1;
    });

    return {
      totalOperations,
      totalPiiDetected,
      averageProcessingTime,
      topPiiTypes,
      operationsByType,
      successRate
    };
  }

  /**
   * Generate a unique ID for audit entries
   */
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Escape CSV values
   */
  private escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

/**
 * Console audit logger implementation
 * Outputs audit logs to console (useful for debugging)
 */
export class ConsoleAuditLogger implements IAuditLogger {
  private delegate: InMemoryAuditLogger;

  constructor(maxLogs: number = 10000) {
    this.delegate = new InMemoryAuditLogger(maxLogs);
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    this.delegate.log(entry);
    console.log('[AUDIT]', {
      timestamp: new Date().toISOString(),
      ...entry
    });
  }

  getLogs(): AuditLogEntry[] {
    return this.delegate.getLogs();
  }

  getLogsByOperation(operation: AuditLogEntry['operation']): AuditLogEntry[] {
    return this.delegate.getLogsByOperation(operation);
  }

  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    return this.delegate.getLogsByDateRange(startDate, endDate);
  }

  exportAsJson(): string {
    return this.delegate.exportAsJson();
  }

  exportAsCsv(): string {
    return this.delegate.exportAsCsv();
  }

  clear(): void {
    this.delegate.clear();
  }

  getStats(): AuditStats {
    return this.delegate.getStats();
  }
}
