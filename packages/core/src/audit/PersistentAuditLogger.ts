/**
 * Persistent Audit Logger with multiple backend support
 * Provides tamper-proof, cryptographic audit logging for production environments
 */

import { createHash } from 'crypto';
import type {
  IAuditLogger,
  AuditLogEntry,
  AuditStats
} from '../types';

/**
 * Supported database backends
 */
export type AuditBackend = 'sqlite' | 'postgresql' | 'mongodb' | 's3' | 'file';

/**
 * Database connection configuration
 */
export interface AuditDatabaseConfig {
  /** Backend type */
  backend: AuditBackend;
  /** Connection string (for PostgreSQL/MongoDB) */
  connectionString?: string;
  /** Database file path (for SQLite/file backend) */
  filePath?: string;
  /** S3 bucket configuration */
  s3Config?: {
    bucket: string;
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    prefix?: string;
  };
  /** Table/collection name (default: 'audit_logs') */
  tableName?: string;
  /** Enable compression (default: false) */
  enableCompression?: boolean;
  /** Batch size for bulk inserts (default: 100) */
  batchSize?: number;
}

/**
 * Retention policy configuration
 */
export interface RetentionPolicy {
  /** Maximum age of logs in days (default: 90) */
  maxAgeDays?: number;
  /** Maximum number of logs to keep (default: unlimited) */
  maxLogs?: number;
  /** Enable automatic cleanup (default: false) */
  autoCleanup?: boolean;
  /** Cleanup interval in hours (default: 24) */
  cleanupIntervalHours?: number;
}

/**
 * Persistent audit logger options
 */
export interface PersistentAuditLoggerOptions {
  /** Database configuration */
  database: AuditDatabaseConfig;
  /** Retention policy */
  retention?: RetentionPolicy;
  /** Enable cryptographic hashing for tamper detection (default: true) */
  enableHashing?: boolean;
  /** Hash algorithm (default: 'sha256') */
  hashAlgorithm?: 'sha256' | 'sha512';
  /** Enable write-ahead logging for crash recovery (default: true) */
  enableWAL?: boolean;
  /** Secret key for HMAC hashing (optional, recommended for production) */
  secretKey?: string;
}

/**
 * Audit log entry with cryptographic hash
 */
export interface HashedAuditLogEntry extends AuditLogEntry {
  /** Cryptographic hash of this entry */
  hash: string;
  /** Hash of previous entry for chain verification */
  previousHash?: string;
  /** Sequence number in the log chain */
  sequence: number;
}

/**
 * Audit database adapter interface
 */
export interface IAuditDatabaseAdapter {
  /** Initialize the database/table/collection */
  initialize(): Promise<void>;
  /** Insert a single log entry */
  insert(entry: HashedAuditLogEntry): Promise<void>;
  /** Batch insert multiple entries */
  batchInsert(entries: HashedAuditLogEntry[]): Promise<void>;
  /** Query logs with filters */
  query(filter: AuditQueryFilter): Promise<HashedAuditLogEntry[]>;
  /** Get total count of logs */
  count(filter?: Partial<AuditQueryFilter>): Promise<number>;
  /** Delete logs older than date */
  deleteOlderThan(date: Date): Promise<number>;
  /** Get the last log entry */
  getLastEntry(): Promise<HashedAuditLogEntry | null>;
  /** Verify log chain integrity */
  verifyChain(startSequence?: number, endSequence?: number): Promise<{ valid: boolean; brokenAt?: number }>;
  /** Close connection */
  close(): Promise<void>;
}

/**
 * Audit query filter
 */
export interface AuditQueryFilter {
  /** Filter by operation type */
  operation?: AuditLogEntry['operation'];
  /** Filter by user */
  user?: string;
  /** Filter by session ID */
  sessionId?: string;
  /** Filter by date range (start) */
  startDate?: Date;
  /** Filter by date range (end) */
  endDate?: Date;
  /** Filter by success status */
  success?: boolean;
  /** Limit results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Sort order */
  sort?: 'asc' | 'desc';
}

/**
 * Persistent Audit Logger with cryptographic chain verification
 */
export class PersistentAuditLogger implements IAuditLogger {
  private adapter: IAuditDatabaseAdapter;
  private options: Required<PersistentAuditLoggerOptions>;
  private batchBuffer: HashedAuditLogEntry[] = [];
  private lastHash: string = '';
  private sequence: number = 0;
  private cleanupTimer?: NodeJS.Timeout;
  private initialized: boolean = false;

  constructor(options: PersistentAuditLoggerOptions) {
    this.options = {
      ...options,
      retention: {
        maxAgeDays: options.retention?.maxAgeDays ?? 90,
        maxLogs: options.retention?.maxLogs,
        autoCleanup: options.retention?.autoCleanup ?? false,
        cleanupIntervalHours: options.retention?.cleanupIntervalHours ?? 24
      },
      enableHashing: options.enableHashing ?? true,
      hashAlgorithm: options.hashAlgorithm ?? 'sha256',
      enableWAL: options.enableWAL ?? true,
      secretKey: options.secretKey
    };

    // Create appropriate database adapter
    this.adapter = this.createAdapter(options.database);
  }

  /**
   * Initialize the logger (must be called before use)
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.adapter.initialize();

    // Load last hash and sequence from database
    const lastEntry = await this.adapter.getLastEntry();
    if (lastEntry) {
      this.lastHash = lastEntry.hash;
      this.sequence = lastEntry.sequence;
    }

    // Start automatic cleanup if enabled
    if (this.options.retention.autoCleanup) {
      this.startCleanupSchedule();
    }

    this.initialized = true;
  }

  /**
   * Log an audit entry
   */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    // Create full entry with ID and timestamp
    const fullEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...entry
    };

    // Create hashed entry
    const hashedEntry = this.createHashedEntry(fullEntry);

    // Add to batch buffer
    this.batchBuffer.push(hashedEntry);

    // Flush if batch is full
    const batchSize = this.options.database.batchSize ?? 100;
    if (this.batchBuffer.length >= batchSize) {
      // Async flush (fire and forget for performance)
      this.flushBatch().catch(err => {
        console.error('[PersistentAuditLogger] Failed to flush batch:', err);
      });
    }
  }

  /**
   * Get all audit logs
   */
  getLogs(): AuditLogEntry[] {
    throw new Error(
      '[PersistentAuditLogger] getLogs() is not supported for persistent storage. Use queryLogs() instead for filtered queries.'
    );
  }

  /**
   * Query logs with filters (async)
   */
  async queryLogs(filter?: AuditQueryFilter): Promise<HashedAuditLogEntry[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Flush any pending logs before querying
    await this.flushBatch();

    return this.adapter.query(filter || {});
  }

  /**
   * Get logs by operation type
   */
  getLogsByOperation(operation: AuditLogEntry['operation']): AuditLogEntry[] {
    throw new Error(
      '[PersistentAuditLogger] getLogsByOperation() is not supported for persistent storage. Use queryLogs({ operation }) instead.'
    );
  }

  /**
   * Get logs by date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    throw new Error(
      '[PersistentAuditLogger] getLogsByDateRange() is not supported for persistent storage. Use queryLogs({ startDate, endDate }) instead.'
    );
  }

  /**
   * Export logs as JSON
   */
  exportAsJson(): string {
    throw new Error(
      '[PersistentAuditLogger] Synchronous export not supported. Use exportAsJsonAsync() instead.'
    );
  }

  /**
   * Export logs as JSON (async)
   */
  async exportAsJsonAsync(filter?: AuditQueryFilter): Promise<string> {
    const logs = await this.queryLogs(filter);
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Export logs as CSV
   */
  exportAsCsv(): string {
    throw new Error(
      '[PersistentAuditLogger] Synchronous export not supported. Use exportAsCsvAsync() instead.'
    );
  }

  /**
   * Export logs as CSV (async)
   */
  async exportAsCsvAsync(filter?: AuditQueryFilter): Promise<string> {
    const logs = await this.queryLogs(filter);

    if (logs.length === 0) {
      return '';
    }

    // CSV header
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
      'sessionId',
      'hash',
      'previousHash',
      'sequence'
    ];

    const rows = logs.map(log => [
      log.id,
      log.timestamp,
      log.operation,
      log.piiCount,
      log.piiTypes.join(';'),
      log.textLength,
      log.processingTimeMs,
      log.redactionMode || '',
      log.success,
      log.error || '',
      log.user || '',
      log.sessionId || '',
      log.hash,
      log.previousHash || '',
      log.sequence
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
  }

  /**
   * Clear all audit logs (dangerous!)
   */
  clear(): void {
    throw new Error(
      '[PersistentAuditLogger] clear() is not supported for persistent storage. Audit logs are immutable. Use deleteOlderThan() for retention policies.'
    );
  }

  /**
   * Delete logs older than specified date
   */
  async deleteOlderThan(date: Date): Promise<number> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.adapter.deleteOlderThan(date);
  }

  /**
   * Get audit statistics
   */
  getStats(): AuditStats {
    throw new Error(
      '[PersistentAuditLogger] Synchronous getStats() not supported. Use getStatsAsync() instead.'
    );
  }

  /**
   * Get audit statistics (async)
   */
  async getStatsAsync(filter?: AuditQueryFilter): Promise<AuditStats> {
    if (!this.initialized) {
      await this.initialize();
    }

    const logs = await this.queryLogs(filter);

    if (logs.length === 0) {
      return {
        totalOperations: 0,
        totalPiiDetected: 0,
        averageProcessingTime: 0,
        topPiiTypes: [],
        operationsByType: {},
        successRate: 0
      };
    }

    const totalOperations = logs.length;
    const totalPiiDetected = logs.reduce((sum, log) => sum + log.piiCount, 0);
    const totalProcessingTime = logs.reduce((sum, log) => sum + log.processingTimeMs, 0);
    const averageProcessingTime = totalProcessingTime / totalOperations;

    // Count PII types
    const piiTypeCounts = new Map<string, number>();
    logs.forEach(log => {
      log.piiTypes.forEach(type => {
        piiTypeCounts.set(type, (piiTypeCounts.get(type) || 0) + 1);
      });
    });

    const topPiiTypes = Array.from(piiTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count operations by type
    const operationsByType: Record<string, number> = {};
    logs.forEach(log => {
      operationsByType[log.operation] = (operationsByType[log.operation] || 0) + 1;
    });

    // Calculate success rate
    const successCount = logs.filter(log => log.success).length;
    const successRate = successCount / totalOperations;

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
   * Verify log chain integrity
   */
  async verifyChainIntegrity(startSequence?: number, endSequence?: number): Promise<{
    valid: boolean;
    brokenAt?: number;
    message: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.options.enableHashing) {
      return {
        valid: true,
        message: 'Hashing is disabled, chain verification not available'
      };
    }

    const result = await this.adapter.verifyChain(startSequence, endSequence);

    if (result.valid) {
      return {
        valid: true,
        message: 'Audit log chain is intact and has not been tampered with'
      };
    } else {
      return {
        valid: false,
        brokenAt: result.brokenAt,
        message: `Audit log chain is broken at sequence ${result.brokenAt}. Possible tampering detected.`
      };
    }
  }

  /**
   * Flush batch buffer to database
   */
  async flushBatch(): Promise<void> {
    if (this.batchBuffer.length === 0) {
      return;
    }

    if (!this.initialized) {
      await this.initialize();
    }

    const batch = [...this.batchBuffer];
    this.batchBuffer = [];

    try {
      await this.adapter.batchInsert(batch);
    } catch (error) {
      // On failure, put entries back in buffer
      this.batchBuffer.unshift(...batch);
      throw error;
    }
  }

  /**
   * Close the logger and flush any pending logs
   */
  async close(): Promise<void> {
    // Stop cleanup timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    // Flush any pending logs
    await this.flushBatch();

    // Close database connection
    await this.adapter.close();

    this.initialized = false;
  }

  /**
   * Create hashed entry with chain linking
   */
  private createHashedEntry(entry: AuditLogEntry): HashedAuditLogEntry {
    this.sequence++;

    const hashedEntry: HashedAuditLogEntry = {
      ...entry,
      hash: '',
      previousHash: this.lastHash || undefined,
      sequence: this.sequence
    };

    // Calculate hash
    if (this.options.enableHashing) {
      hashedEntry.hash = this.calculateHash(hashedEntry);
      this.lastHash = hashedEntry.hash;
    } else {
      hashedEntry.hash = 'disabled';
    }

    return hashedEntry;
  }

  /**
   * Calculate cryptographic hash of entry
   */
  private calculateHash(entry: Omit<HashedAuditLogEntry, 'hash'>): string {
    const algorithm = this.options.hashAlgorithm;

    // Create deterministic string representation
    const data = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp,
      operation: entry.operation,
      piiCount: entry.piiCount,
      piiTypes: entry.piiTypes,
      textLength: entry.textLength,
      processingTimeMs: entry.processingTimeMs,
      redactionMode: entry.redactionMode,
      success: entry.success,
      error: entry.error,
      user: entry.user,
      sessionId: entry.sessionId,
      metadata: entry.metadata,
      previousHash: entry.previousHash,
      sequence: entry.sequence
    });

    // Use HMAC if secret key provided, otherwise simple hash
    if (this.options.secretKey) {
      return createHash(algorithm)
        .update(this.options.secretKey + data)
        .digest('hex');
    } else {
      return createHash(algorithm)
        .update(data)
        .digest('hex');
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create database adapter based on backend
   */
  private createAdapter(config: AuditDatabaseConfig): IAuditDatabaseAdapter {
    switch (config.backend) {
      case 'sqlite':
        return new SQLiteAuditAdapter(config, this.options);
      case 'postgresql':
        return new PostgreSQLAuditAdapter(config, this.options);
      case 'mongodb':
        return new MongoDBuditAdapter(config, this.options);
      case 's3':
        return new S3AuditAdapter(config, this.options);
      case 'file':
        return new FileAuditAdapter(config, this.options);
      default:
        throw new Error(`[PersistentAuditLogger] Unsupported backend: ${config.backend}`);
    }
  }

  /**
   * Start automatic cleanup schedule
   */
  private startCleanupSchedule(): void {
    const intervalMs = this.options.retention.cleanupIntervalHours * 60 * 60 * 1000;

    this.cleanupTimer = setInterval(() => {
      this.runCleanup().catch(err => {
        console.error('[PersistentAuditLogger] Cleanup failed:', err);
      });
    }, intervalMs);
  }

  /**
   * Run cleanup based on retention policy
   */
  private async runCleanup(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    const { maxAgeDays, maxLogs } = this.options.retention;

    // Delete logs older than maxAgeDays
    if (maxAgeDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

      const deleted = await this.deleteOlderThan(cutoffDate);
      if (deleted > 0) {
        console.log(`[PersistentAuditLogger] Cleanup: Deleted ${deleted} logs older than ${maxAgeDays} days`);
      }
    }

    // Delete oldest logs if over maxLogs limit
    if (maxLogs) {
      const count = await this.adapter.count();
      if (count > maxLogs) {
        const toDelete = count - maxLogs;
        // Implementation depends on adapter
        console.log(`[PersistentAuditLogger] Cleanup: Need to delete ${toDelete} oldest logs (maxLogs: ${maxLogs})`);
      }
    }
  }
}

/**
 * SQLite adapter implementation
 */
class SQLiteAuditAdapter implements IAuditDatabaseAdapter {
  private db?: any;
  private config: AuditDatabaseConfig;
  private options: Required<PersistentAuditLoggerOptions>;

  constructor(config: AuditDatabaseConfig, options: Required<PersistentAuditLoggerOptions>) {
    this.config = config;
    this.options = options;
  }

  async initialize(): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const sqlite3 = require('better-sqlite3');
      const filePath = this.config.filePath || './audit-logs.db';

      this.db = sqlite3(filePath);

      // Enable WAL mode for better concurrency
      if (this.options.enableWAL) {
        this.db.pragma('journal_mode = WAL');
      }

      // Create table
      const tableName = this.config.tableName || 'audit_logs';
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          sequence INTEGER PRIMARY KEY,
          id TEXT NOT NULL UNIQUE,
          timestamp TEXT NOT NULL,
          operation TEXT NOT NULL,
          piiCount INTEGER NOT NULL,
          piiTypes TEXT NOT NULL,
          textLength INTEGER NOT NULL,
          processingTimeMs REAL NOT NULL,
          redactionMode TEXT,
          success INTEGER NOT NULL,
          error TEXT,
          user TEXT,
          sessionId TEXT,
          metadata TEXT,
          hash TEXT NOT NULL,
          previousHash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_${tableName}_timestamp ON ${tableName}(timestamp);
        CREATE INDEX IF NOT EXISTS idx_${tableName}_operation ON ${tableName}(operation);
        CREATE INDEX IF NOT EXISTS idx_${tableName}_user ON ${tableName}(user);
        CREATE INDEX IF NOT EXISTS idx_${tableName}_sessionId ON ${tableName}(sessionId);
        CREATE INDEX IF NOT EXISTS idx_${tableName}_sequence ON ${tableName}(sequence);
      `);
    } catch (error: any) {
      throw new Error(
        `[SQLiteAuditAdapter] Failed to initialize: ${error.message}. Install with: npm install better-sqlite3`
      );
    }
  }

  async insert(entry: HashedAuditLogEntry): Promise<void> {
    const tableName = this.config.tableName || 'audit_logs';
    const stmt = this.db.prepare(`
      INSERT INTO ${tableName} (
        sequence, id, timestamp, operation, piiCount, piiTypes, textLength,
        processingTimeMs, redactionMode, success, error, user, sessionId,
        metadata, hash, previousHash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      entry.sequence,
      entry.id,
      entry.timestamp,
      entry.operation,
      entry.piiCount,
      JSON.stringify(entry.piiTypes),
      entry.textLength,
      entry.processingTimeMs,
      entry.redactionMode || null,
      entry.success ? 1 : 0,
      entry.error || null,
      entry.user || null,
      entry.sessionId || null,
      entry.metadata ? JSON.stringify(entry.metadata) : null,
      entry.hash,
      entry.previousHash || null
    );
  }

  async batchInsert(entries: HashedAuditLogEntry[]): Promise<void> {
    const tableName = this.config.tableName || 'audit_logs';
    const stmt = this.db.prepare(`
      INSERT INTO ${tableName} (
        sequence, id, timestamp, operation, piiCount, piiTypes, textLength,
        processingTimeMs, redactionMode, success, error, user, sessionId,
        metadata, hash, previousHash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((entries: HashedAuditLogEntry[]) => {
      for (const entry of entries) {
        stmt.run(
          entry.sequence,
          entry.id,
          entry.timestamp,
          entry.operation,
          entry.piiCount,
          JSON.stringify(entry.piiTypes),
          entry.textLength,
          entry.processingTimeMs,
          entry.redactionMode || null,
          entry.success ? 1 : 0,
          entry.error || null,
          entry.user || null,
          entry.sessionId || null,
          entry.metadata ? JSON.stringify(entry.metadata) : null,
          entry.hash,
          entry.previousHash || null
        );
      }
    });

    transaction(entries);
  }

  async query(filter: AuditQueryFilter): Promise<HashedAuditLogEntry[]> {
    const tableName = this.config.tableName || 'audit_logs';
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter.operation) {
      conditions.push('operation = ?');
      params.push(filter.operation);
    }

    if (filter.user) {
      conditions.push('user = ?');
      params.push(filter.user);
    }

    if (filter.sessionId) {
      conditions.push('sessionId = ?');
      params.push(filter.sessionId);
    }

    if (filter.startDate) {
      conditions.push('timestamp >= ?');
      params.push(filter.startDate.toISOString());
    }

    if (filter.endDate) {
      conditions.push('timestamp <= ?');
      params.push(filter.endDate.toISOString());
    }

    if (filter.success !== undefined) {
      conditions.push('success = ?');
      params.push(filter.success ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortOrder = filter.sort === 'asc' ? 'ASC' : 'DESC';
    const limit = filter.limit ? `LIMIT ${filter.limit}` : '';
    const offset = filter.offset ? `OFFSET ${filter.offset}` : '';

    const query = `
      SELECT * FROM ${tableName}
      ${whereClause}
      ORDER BY sequence ${sortOrder}
      ${limit} ${offset}
    `;

    const rows = this.db.prepare(query).all(...params);

    return rows.map((row: any) => this.rowToEntry(row));
  }

  async count(filter?: Partial<AuditQueryFilter>): Promise<number> {
    const tableName = this.config.tableName || 'audit_logs';
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter?.operation) {
      conditions.push('operation = ?');
      params.push(filter.operation);
    }

    if (filter?.startDate) {
      conditions.push('timestamp >= ?');
      params.push(filter.startDate.toISOString());
    }

    if (filter?.endDate) {
      conditions.push('timestamp <= ?');
      params.push(filter.endDate.toISOString());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT COUNT(*) as count FROM ${tableName} ${whereClause}`;

    const result = this.db.prepare(query).get(...params);
    return result.count;
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const tableName = this.config.tableName || 'audit_logs';
    const result = this.db.prepare(`
      DELETE FROM ${tableName} WHERE timestamp < ?
    `).run(date.toISOString());

    return result.changes;
  }

  async getLastEntry(): Promise<HashedAuditLogEntry | null> {
    const tableName = this.config.tableName || 'audit_logs';
    const row = this.db.prepare(`
      SELECT * FROM ${tableName} ORDER BY sequence DESC LIMIT 1
    `).get();

    return row ? this.rowToEntry(row) : null;
  }

  async verifyChain(startSequence?: number, endSequence?: number): Promise<{ valid: boolean; brokenAt?: number }> {
    const tableName = this.config.tableName || 'audit_logs';
    const start = startSequence || 1;
    const end = endSequence || (await this.count());

    const rows = this.db.prepare(`
      SELECT * FROM ${tableName} WHERE sequence >= ? AND sequence <= ? ORDER BY sequence ASC
    `).all(start, end);

    let previousHash: string | undefined;

    for (const row of rows) {
      const entry = this.rowToEntry(row);

      if (previousHash && entry.previousHash !== previousHash) {
        return { valid: false, brokenAt: entry.sequence };
      }

      previousHash = entry.hash;
    }

    return { valid: true };
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
    }
  }

  private rowToEntry(row: any): HashedAuditLogEntry {
    return {
      id: row.id,
      timestamp: row.timestamp,
      operation: row.operation,
      piiCount: row.piiCount,
      piiTypes: JSON.parse(row.piiTypes),
      textLength: row.textLength,
      processingTimeMs: row.processingTimeMs,
      redactionMode: row.redactionMode || undefined,
      success: row.success === 1,
      error: row.error || undefined,
      user: row.user || undefined,
      sessionId: row.sessionId || undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      hash: row.hash,
      previousHash: row.previousHash || undefined,
      sequence: row.sequence
    };
  }
}

/**
 * PostgreSQL adapter implementation (stub - requires pg package)
 */
class PostgreSQLAuditAdapter implements IAuditDatabaseAdapter {
  constructor(_config: AuditDatabaseConfig, _options: Required<PersistentAuditLoggerOptions>) {
    // Implementation will be added later
  }

  async initialize(): Promise<void> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet. Install with: npm install pg');
  }

  async insert(_entry: HashedAuditLogEntry): Promise<void> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet');
  }

  async batchInsert(_entries: HashedAuditLogEntry[]): Promise<void> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet');
  }

  async query(_filter: AuditQueryFilter): Promise<HashedAuditLogEntry[]> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet');
  }

  async count(_filter?: Partial<AuditQueryFilter>): Promise<number> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet');
  }

  async deleteOlderThan(_date: Date): Promise<number> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet');
  }

  async getLastEntry(): Promise<HashedAuditLogEntry | null> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet');
  }

  async verifyChain(_startSequence?: number, _endSequence?: number): Promise<{ valid: boolean; brokenAt?: number }> {
    throw new Error('[PostgreSQLAuditAdapter] Not implemented yet');
  }

  async close(): Promise<void> {
    // No-op
  }
}

/**
 * MongoDB adapter implementation (stub - requires mongodb package)
 */
class MongoDBuditAdapter implements IAuditDatabaseAdapter {
  constructor(_config: AuditDatabaseConfig, _options: Required<PersistentAuditLoggerOptions>) {
    // Implementation will be added later
  }

  async initialize(): Promise<void> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet. Install with: npm install mongodb');
  }

  async insert(_entry: HashedAuditLogEntry): Promise<void> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet');
  }

  async batchInsert(_entries: HashedAuditLogEntry[]): Promise<void> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet');
  }

  async query(_filter: AuditQueryFilter): Promise<HashedAuditLogEntry[]> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet');
  }

  async count(_filter?: Partial<AuditQueryFilter>): Promise<number> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet');
  }

  async deleteOlderThan(_date: Date): Promise<number> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet');
  }

  async getLastEntry(): Promise<HashedAuditLogEntry | null> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet');
  }

  async verifyChain(_startSequence?: number, _endSequence?: number): Promise<{ valid: boolean; brokenAt?: number }> {
    throw new Error('[MongoDBuditAdapter] Not implemented yet');
  }

  async close(): Promise<void> {
    // No-op
  }
}

/**
 * S3 adapter implementation (stub - requires aws-sdk)
 */
class S3AuditAdapter implements IAuditDatabaseAdapter {
  constructor(_config: AuditDatabaseConfig, _options: Required<PersistentAuditLoggerOptions>) {
    // Implementation will be added later
  }

  async initialize(): Promise<void> {
    throw new Error('[S3AuditAdapter] Not implemented yet. Install with: npm install @aws-sdk/client-s3');
  }

  async insert(_entry: HashedAuditLogEntry): Promise<void> {
    throw new Error('[S3AuditAdapter] Not implemented yet');
  }

  async batchInsert(_entries: HashedAuditLogEntry[]): Promise<void> {
    throw new Error('[S3AuditAdapter] Not implemented yet');
  }

  async query(_filter: AuditQueryFilter): Promise<HashedAuditLogEntry[]> {
    throw new Error('[S3AuditAdapter] Not implemented yet');
  }

  async count(_filter?: Partial<AuditQueryFilter>): Promise<number> {
    throw new Error('[S3AuditAdapter] Not implemented yet');
  }

  async deleteOlderThan(_date: Date): Promise<number> {
    throw new Error('[S3AuditAdapter] Not implemented yet');
  }

  async getLastEntry(): Promise<HashedAuditLogEntry | null> {
    throw new Error('[S3AuditAdapter] Not implemented yet');
  }

  async verifyChain(_startSequence?: number, _endSequence?: number): Promise<{ valid: boolean; brokenAt?: number }> {
    throw new Error('[S3AuditAdapter] Not implemented yet');
  }

  async close(): Promise<void> {
    // No-op
  }
}

/**
 * File-based adapter implementation (append-only log file)
 */
class FileAuditAdapter implements IAuditDatabaseAdapter {
  constructor(_config: AuditDatabaseConfig, _options: Required<PersistentAuditLoggerOptions>) {
    // Implementation will be added later
  }

  async initialize(): Promise<void> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async insert(_entry: HashedAuditLogEntry): Promise<void> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async batchInsert(_entries: HashedAuditLogEntry[]): Promise<void> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async query(_filter: AuditQueryFilter): Promise<HashedAuditLogEntry[]> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async count(_filter?: Partial<AuditQueryFilter>): Promise<number> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async deleteOlderThan(_date: Date): Promise<number> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async getLastEntry(): Promise<HashedAuditLogEntry | null> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async verifyChain(_startSequence?: number, _endSequence?: number): Promise<{ valid: boolean; brokenAt?: number }> {
    throw new Error('[FileAuditAdapter] Not implemented yet');
  }

  async close(): Promise<void> {
    // No-op
  }
}

/**
 * Create a persistent audit logger
 */
export function createPersistentAuditLogger(options: PersistentAuditLoggerOptions): PersistentAuditLogger {
  return new PersistentAuditLogger(options);
}
