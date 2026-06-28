/**
 * Audit logging module (in-memory implementations)
 *
 * For persistent backends (SQLite, PostgreSQL, MongoDB, S3, file),
 * use @openredaction/api instead.
 */

export { InMemoryAuditLogger, ConsoleAuditLogger } from "./AuditLogger";
export type { IAuditLogger, AuditLogEntry, AuditStats } from "../types";
