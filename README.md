# OpenRedaction

[![Version](https://img.shields.io/badge/version-0.1.0--pre--release-orange.svg)](https://github.com/sam247/openredact)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-276%20passing-brightgreen.svg)](https://github.com/sam247/openredact)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)

![Custom dimensions 1280x640 px](https://github.com/user-attachments/assets/8af856bf-0eb5-4223-949f-44ee29cfebd9)

**Production-ready PII detection and redaction for JavaScript/TypeScript**

Local-first • Zero dependencies • 10-20ms latency • 100% offline • 558+ patterns

## Features

- **Lightning Fast** - <2ms processing for 2KB text, 100x faster than cloud APIs
- **558+ PII Patterns** - Comprehensive coverage across 25+ industries and 50+ countries
- **Structured Data Support** - JSON, CSV, XLSX (Excel) with path/cell tracking
- **Context-Aware** - 90%+ accuracy with false positive reduction
- **Compliance Ready** - GDPR, HIPAA, CCPA, FERPA presets
- **100% Local** - Your data never leaves your infrastructure
- **Zero Dependencies** - ~100KB bundle, works everywhere (structured data built-in)
- **Document Processing** - PDF, DOCX, TXT, JSON, CSV, XLSX, images (OCR)
- **Advanced Features** - Streaming, batch processing, explain API, HTML reports
- **Framework Ready** - React hooks, Express middleware included
- **TypeScript Native** - Full type safety with exported types
- **Battle Tested** - 276 tests passing, production-ready

## Installation

```bash
npm install openredaction
```

## Quick Start

```typescript
import { OpenRedaction } from 'openredaction';

const shield = new OpenRedaction();
const result = shield.detect("Email john@example.com or call 07700900123");

console.log(result.redacted);
// "Email [EMAIL_9619] or call [PHONE_UK_MOBILE_9478]"

console.log(result.detections);
// [
//   { type: 'EMAIL', value: 'john@example.com', severity: 'high', ... },
//   { type: 'PHONE_UK_MOBILE', value: '07700900123', severity: 'medium', ... }
// ]

// Restore original text
const restored = shield.restore(result.redacted, result.redactionMap);
console.log(restored);
// "Email john@example.com or call 07700900123"
```

## Redaction Modes

OpenRedaction supports multiple redaction strategies to balance security and usability:

```typescript
import { OpenRedaction } from 'openredaction';

// Placeholder mode (default) - Reversible
const placeholder = new OpenRedaction({ redactionMode: 'placeholder' });
placeholder.detect("Email john@example.com").redacted;
// "Email [EMAIL_9619]"

// Mask middle - Partial visibility
const maskMiddle = new OpenRedaction({ redactionMode: 'mask-middle' });
maskMiddle.detect("Email john@example.com or call 555-123-4567").redacted;
// "Email j***@example.com or call 555-**-4567"

// Mask all - Complete masking
const maskAll = new OpenRedaction({ redactionMode: 'mask-all' });
maskAll.detect("SSN: 123-45-6789").redacted;
// "SSN: ***************"

// Format preserving - Keep structure
const formatPreserving = new OpenRedaction({ redactionMode: 'format-preserving' });
formatPreserving.detect("Call 555-123-4567").redacted;
// "Call XXX-XXX-XXXX"

// Token replace - Realistic fake data
const tokenReplace = new OpenRedaction({ redactionMode: 'token-replace' });
tokenReplace.detect("Email john@example.com").redacted;
// "Email user47@example.com"
```

## Audit Logging (Enterprise)

Track all redaction operations with comprehensive audit logging for compliance and monitoring:

```typescript
import { OpenRedaction, InMemoryAuditLogger, ConsoleAuditLogger } from 'openredaction';

// Enable audit logging with default in-memory logger
const redactor = new OpenRedaction({
  enableAuditLog: true,
  auditUser: 'john.doe@company.com',
  auditSessionId: 'session-123',
  auditMetadata: { department: 'legal', requestId: 'req-456' }
});

// Process text (audit logged automatically)
const result = redactor.detect("Email: john@example.com, SSN: 123-45-6789");

// Access audit logs
const auditLogger = redactor.getAuditLogger();
const logs = auditLogger.getLogs();

console.log(logs);
// [
//   {
//     id: 'audit_1234567890_abc123',
//     timestamp: '2025-01-15T10:30:00.000Z',
//     operation: 'redact',
//     piiCount: 2,
//     piiTypes: ['EMAIL', 'SSN'],
//     textLength: 45,
//     processingTimeMs: 12.5,
//     redactionMode: 'placeholder',
//     success: true,
//     user: 'john.doe@company.com',
//     sessionId: 'session-123',
//     metadata: { department: 'legal', requestId: 'req-456' }
//   }
// ]

// Get statistics
const stats = auditLogger.getStats();
console.log(stats);
// {
//   totalOperations: 150,
//   totalPiiDetected: 487,
//   averageProcessingTime: 15.2,
//   topPiiTypes: [
//     { type: 'EMAIL', count: 95 },
//     { type: 'PHONE_US', count: 72 },
//     { type: 'SSN', count: 45 }
//   ],
//   operationsByType: { redact: 140, restore: 10 },
//   successRate: 0.99
// }

// Export audit logs
const jsonExport = auditLogger.exportAsJson();
const csvExport = auditLogger.exportAsCsv();

// Save to file for compliance
fs.writeFileSync('audit-log.json', jsonExport);
fs.writeFileSync('audit-log.csv', csvExport);

// Filter logs by operation
const redactOperations = auditLogger.getLogsByOperation('redact');

// Filter logs by date range
const lastWeek = auditLogger.getLogsByDateRange(
  new Date('2025-01-08'),
  new Date('2025-01-15')
);

// Use console logger for debugging
const debugRedactor = new OpenRedaction({
  enableAuditLog: true,
  auditLogger: new ConsoleAuditLogger()
});
```

### Custom Audit Logger

Implement `IAuditLogger` for custom storage (database, cloud, etc):

```typescript
import { IAuditLogger, AuditLogEntry, AuditStats } from 'openredaction';

class DatabaseAuditLogger implements IAuditLogger {
  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    await db.auditLogs.insert({
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    });
  }

  async getLogs(): Promise<AuditLogEntry[]> {
    return db.auditLogs.findAll();
  }

  // Implement other interface methods...
}

const redactor = new OpenRedaction({
  enableAuditLog: true,
  auditLogger: new DatabaseAuditLogger()
});
```

## Metrics Export (Enterprise)

Monitor and analyze redaction performance with built-in metrics collection and export:

```typescript
import { OpenRedaction, InMemoryMetricsCollector } from 'openredaction';

// Enable metrics collection
const redactor = new OpenRedaction({
  enableMetrics: true
});

// Process some text
redactor.detect("Email: john@example.com, SSN: 123-45-6789");
redactor.detect("Call 555-123-4567 or visit website.com");
redactor.detect("Account #12345, Card: 4532-0151-1283-0366");

// Access metrics
const metricsCollector = redactor.getMetricsCollector();
const exporter = metricsCollector.getExporter();

// Get current metrics
const metrics = exporter.getMetrics();
console.log(metrics);
// {
//   totalRedactions: 3,
//   totalPiiDetected: 6,
//   totalProcessingTime: 45.3,
//   averageProcessingTime: 15.1,
//   totalTextLength: 156,
//   piiByType: {
//     EMAIL: 1,
//     SSN: 1,
//     PHONE_US: 1,
//     ACCOUNT_NUMBER: 1,
//     CREDIT_CARD: 1,
//     URL: 1
//   },
//   byRedactionMode: {
//     placeholder: 3
//   },
//   totalErrors: 0,
//   lastUpdated: '2025-01-15T10:45:00.000Z'
// }

// Export as Prometheus format
const prometheusMetrics = exporter.exportPrometheus();
console.log(prometheusMetrics);
/*
# HELP openredaction_total_redactions Total number of redaction operations
# TYPE openredaction_total_redactions counter
openredaction_total_redactions 3 1736938800000

# HELP openredaction_total_pii_detected Total number of PII items detected
# TYPE openredaction_total_pii_detected counter
openredaction_total_pii_detected 6 1736938800000

# HELP openredaction_avg_processing_time_ms Average processing time in milliseconds
# TYPE openredaction_avg_processing_time_ms gauge
openredaction_avg_processing_time_ms 15.10 1736938800000

# HELP openredaction_pii_by_type PII detection counts by type
# TYPE openredaction_pii_by_type counter
openredaction_pii_by_type{type="EMAIL"} 1 1736938800000
openredaction_pii_by_type{type="SSN"} 1 1736938800000
openredaction_pii_by_type{type="PHONE_US"} 1 1736938800000
...
*/

// Export as StatsD format
const statsdMetrics = exporter.exportStatsD();
console.log(statsdMetrics);
/*
[
  'openredaction.total_redactions:3|c',
  'openredaction.total_pii_detected:6|c',
  'openredaction.total_processing_time_ms:45.30|c',
  'openredaction.total_text_length:156|c',
  'openredaction.total_errors:0|c',
  'openredaction.avg_processing_time_ms:15.10|g',
  'openredaction.pii_by_type:1|c|#type:EMAIL',
  'openredaction.pii_by_type:1|c|#type:SSN',
  'openredaction.pii_by_type:1|c|#type:PHONE_US',
  ...
]
*/

// Custom prefix for multi-tenant scenarios
const customPrometheus = exporter.exportPrometheus(metrics, 'myapp_pii');
const customStatsD = exporter.exportStatsD(metrics, 'myapp.pii');

// Reset metrics
exporter.reset();
```

### Integration with Monitoring Systems

**Prometheus**:
```typescript
import express from 'express';
import { OpenRedaction } from 'openredaction';

const app = express();
const redactor = new OpenRedaction({ enableMetrics: true });

// Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  const exporter = redactor.getMetricsCollector()?.getExporter();
  if (exporter) {
    res.set('Content-Type', 'text/plain');
    res.send(exporter.exportPrometheus());
  } else {
    res.status(404).send('Metrics not enabled');
  }
});

app.listen(3000);
```

**StatsD/Datadog**:
```typescript
import { StatsD } from 'node-statsd';
import { OpenRedaction } from 'openredaction';

const statsd = new StatsD();
const redactor = new OpenRedaction({ enableMetrics: true });

// Periodically push metrics to StatsD
setInterval(() => {
  const exporter = redactor.getMetricsCollector()?.getExporter();
  if (exporter) {
    const metrics = exporter.exportStatsD();
    metrics.forEach(metric => {
      // Parse and send to StatsD
      const [name, rest] = metric.split(':');
      const [value, type] = rest.split('|');
      statsd.gauge(name, parseFloat(value));
    });
  }
}, 10000); // Every 10 seconds
```

## RBAC (Role-Based Access Control)

Control access to operations with fine-grained permissions and predefined roles:

```typescript
import { OpenRedaction, ANALYST_ROLE, OPERATOR_ROLE, VIEWER_ROLE } from 'openredaction';

// Enable RBAC with a predefined role
const analystRedactor = new OpenRedaction({
  enableRBAC: true,
  role: 'analyst'  // admin, analyst, operator, viewer
});

// Analyst can detect and redact
const result = analystRedactor.detect("Email: john@example.com");
// ✓ Allowed - analysts have 'detection:detect' permission

// But cannot reset metrics
const metrics = analystRedactor.getMetricsCollector();
metrics?.getExporter().reset();
// ✗ Error: Permission denied - analysts lack 'metrics:reset'

// Viewer role - read-only access
const viewerRedactor = new OpenRedaction({
  enableRBAC: true,
  role: 'viewer'
});

viewerRedactor.detect("Email: john@example.com");
// ✗ Error: Permission denied - viewers lack 'detection:detect'

// But can view audit logs
const auditLogger = viewerRedactor.getAuditLogger();
const logs = auditLogger?.getLogs();
// ✓ Allowed - viewers have 'audit:read' permission
```

### Predefined Roles

**Admin Role** - Full access to all operations:
- All permissions (`pattern:*`, `detection:*`, `audit:*`, `metrics:*`, `config:*`)

**Analyst Role** - Detection and read access:
- `pattern:read`, `detection:detect`, `detection:redact`, `detection:restore`
- `audit:read`, `audit:export`, `metrics:read`, `metrics:export`, `config:read`

**Operator Role** - Basic detection operations:
- `pattern:read`, `detection:detect`, `detection:redact`
- `audit:read`, `metrics:read`

**Viewer Role** - Read-only access:
- `pattern:read`, `audit:read`, `audit:export`, `metrics:read`, `metrics:export`, `config:read`

### Custom Roles

Create custom roles with specific permission sets:

```typescript
import { OpenRedaction, createCustomRole, RBACManager } from 'openredaction';

// Create a custom role
const dataProcessorRole = createCustomRole(
  'data_processor',
  [
    'pattern:read',
    'detection:detect',
    'detection:redact',
    'metrics:read'
  ],
  'Custom role for data processing workflows'
);

// Use custom role
const rbacManager = new RBACManager(dataProcessorRole);
const redactor = new OpenRedaction({
  enableRBAC: true,
  rbacManager
});

// Check permissions programmatically
const manager = redactor.getRBACManager();
if (manager?.hasPermission('detection:detect')) {
  const result = redactor.detect("Sensitive text");
}

// Check multiple permissions
if (manager?.hasAllPermissions(['detection:detect', 'audit:read'])) {
  // User has both permissions
}

// Check any permission
if (manager?.hasAnyPermission(['audit:read', 'audit:export'])) {
  // User has at least one permission
}
```

### Available Permissions

**Pattern Management**:
- `pattern:read` - View patterns
- `pattern:write` - Add/modify patterns
- `pattern:delete` - Remove patterns

**Detection Operations**:
- `detection:detect` - Run detection operations
- `detection:redact` - Perform redaction
- `detection:restore` - Restore redacted text

**Audit Log Access**:
- `audit:read` - Read audit logs
- `audit:export` - Export audit logs (JSON/CSV)
- `audit:delete` - Clear audit logs

**Metrics Access**:
- `metrics:read` - Read metrics
- `metrics:export` - Export metrics (Prometheus/StatsD)
- `metrics:reset` - Reset metrics

**Configuration**:
- `config:read` - Read configuration
- `config:write` - Modify configuration

### Permission Enforcement

Permissions are enforced on all protected operations:

```typescript
const operatorRedactor = new OpenRedaction({
  enableRBAC: true,
  role: 'operator'
});

try {
  // Operators can detect
  operatorRedactor.detect("Email: test@example.com");
  // ✓ Success

  // But cannot access metrics exporter's reset function
  const exporter = operatorRedactor.getMetricsCollector()?.getExporter();
  exporter?.reset();
  // Note: Permission check happens at getMetricsCollector(),
  // operator role has metrics:read but not metrics:reset

} catch (error) {
  console.error(error.message);
  // Permission denied: [permission] required
}
```

### Multi-Tenant Scenarios

Use RBAC for multi-tenant applications:

```typescript
import express from 'express';
import { OpenRedaction, getPredefinedRole, RBACManager } from 'openredaction';

const app = express();

// Map user roles from your auth system
const userRoles = {
  'admin@company.com': 'admin',
  'analyst@company.com': 'analyst',
  'support@company.com': 'operator',
  'auditor@company.com': 'viewer'
};

app.post('/api/redact', authenticate, (req, res) => {
  const userRole = userRoles[req.user.email] || 'viewer';
  const role = getPredefinedRole(userRole);

  if (!role) {
    return res.status(403).json({ error: 'Invalid role' });
  }

  const redactor = new OpenRedaction({
    enableRBAC: true,
    rbacManager: new RBACManager(role),
    enableAuditLog: true,
    auditUser: req.user.email
  });

  try {
    const result = redactor.detect(req.body.text);
    res.json(result);
  } catch (error) {
    if (error.message.includes('Permission denied')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal error' });
    }
  }
});
```

## Document Processing (PDF, Word, Text, JSON, CSV, Excel)

Process and redact PII from various document formats with built-in text extraction and structured data support:

### Installation

Document processing requires optional peer dependencies:

```bash
# For PDF support
npm install pdf-parse

# For Word (DOCX) support
npm install mammoth

# For Excel (XLSX) support
npm install xlsx

# Or install all
npm install pdf-parse mammoth xlsx
```

**Note**: JSON and CSV support is built-in (no dependencies required).

### Basic Usage

```typescript
import { OpenRedaction } from 'openredaction';
import fs from 'fs/promises';

const redactor = new OpenRedaction();

// Process PDF document
const pdfBuffer = await fs.readFile('document.pdf');
const pdfResult = await redactor.detectDocument(pdfBuffer);

console.log('Extracted text:', pdfResult.text);
console.log('Found PII:', pdfResult.detection.detections);
console.log('Redacted text:', pdfResult.detection.redacted);
console.log('Document metadata:', pdfResult.metadata);

// Or use convenience method with file path
const result = await redactor.detectDocumentFile('contract.docx');
console.log(`Found ${result.detection.detections.length} PII items in ${result.extractionTime}ms`);
```

### Supported Formats

**PDF**:
- Text extraction from PDF files
- Password-protected PDF support
- Metadata extraction (pages, title, author, dates)
- Requires: `pdf-parse`

**DOCX (Word)**:
- Text extraction from Word documents
- Modern Office Open XML format
- Requires: `mammoth`

**JSON**:
- Nested object traversal with path tracking
- JSON Lines (JSONL) support
- Structure-preserving redaction
- Built-in (no dependencies)

**CSV**:
- Auto-delimiter detection (comma, tab, semicolon, pipe)
- Header detection and column tracking
- Column-level PII statistics
- Built-in (no dependencies)

**XLSX (Excel)**:
- Multi-sheet support
- Cell-level coordinate tracking (A1, B2, etc.)
- Formula preservation
- Requires: `xlsx`

**TXT**:
- Plain text files (built-in, no dependencies)
- UTF-8 encoding

### Document Options

```typescript
import { OpenRedaction } from 'openredaction';

const redactor = new OpenRedaction();

// Auto-detect format
const result1 = await redactor.detectDocument(buffer);

// Specify format explicitly
const result2 = await redactor.detectDocument(buffer, {
  format: 'pdf'
});

// Extract specific pages (PDF only)
const result3 = await redactor.detectDocument(pdfBuffer, {
  format: 'pdf',
  pages: [1, 2, 3]  // Pages 1-3 (1-indexed)
});

// Password-protected PDF
const result4 = await redactor.detectDocument(pdfBuffer, {
  format: 'pdf',
  password: 'secret123'
});

// Size limit (default: 50MB)
const result5 = await redactor.detectDocument(buffer, {
  maxSize: 10 * 1024 * 1024  // 10MB max
});
```

### Document Result

The `detectDocument` method returns comprehensive information:

```typescript
interface DocumentResult {
  text: string;              // Extracted text
  metadata: DocumentMetadata; // Document info
  detection: DetectionResult; // PII detection results
  fileSize: number;          // Original file size in bytes
  extractionTime: number;    // Extraction time in ms
}

// Example
const result = await redactor.detectDocumentFile('resume.pdf');

console.log(`
File size: ${result.fileSize} bytes
Extraction time: ${result.extractionTime}ms
Pages: ${result.metadata.pages}
Title: ${result.metadata.title}
Author: ${result.metadata.author}
Found PII: ${result.detection.detections.length} items
`);

// Access detected PII
result.detection.detections.forEach(detection => {
  console.log(`${detection.type}: ${detection.value} (${detection.severity})`);
});

// Get redacted document text
const redactedText = result.detection.redacted;
```

### Batch Document Processing

Process multiple documents efficiently:

```typescript
import { OpenRedaction } from 'openredaction';
import { glob } from 'glob';
import fs from 'fs/promises';

const redactor = new OpenRedaction({
  enableAuditLog: true,
  enableMetrics: true
});

// Find all documents
const files = await glob('documents/**/*.{pdf,docx,txt}');

// Process in parallel
const results = await Promise.all(
  files.map(async (file) => {
    try {
      const result = await redactor.detectDocumentFile(file);
      return {
        file,
        success: true,
        piiCount: result.detection.detections.length,
        extractionTime: result.extractionTime
      };
    } catch (error) {
      return {
        file,
        success: false,
        error: error.message
      };
    }
  })
);

// Summary
const successful = results.filter(r => r.success);
const failed = results.filter(r => !r.success);

console.log(`Processed: ${successful.length} successful, ${failed.length} failed`);
console.log(`Total PII found: ${successful.reduce((sum, r) => sum + (r.piiCount || 0), 0)}`);
```

### Integration with Express

```typescript
import express from 'express';
import multer from 'multer';
import { OpenRedaction } from 'openredaction';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const redactor = new OpenRedaction();

app.post('/api/documents/scan', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await redactor.detectDocument(req.file.buffer, {
      format: req.body.format // Optional format hint
    });

    res.json({
      filename: req.file.originalname,
      format: result.metadata.format,
      pages: result.metadata.pages,
      piiFound: result.detection.detections.length,
      detections: result.detection.detections.map(d => ({
        type: d.type,
        severity: d.severity,
        confidence: d.confidence
      })),
      extractionTime: result.extractionTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Error Handling

```typescript
try {
  const result = await redactor.detectDocument(buffer);
} catch (error) {
  if (error.message.includes('PDF support requires pdf-parse')) {
    console.error('Please install pdf-parse: npm install pdf-parse');
  } else if (error.message.includes('DOCX support requires mammoth')) {
    console.error('Please install mammoth: npm install mammoth');
  } else if (error.message.includes('Unable to detect document format')) {
    console.error('Unsupported file format. Supported: PDF, DOCX, TXT');
  } else if (error.message.includes('exceeds maximum')) {
    console.error('Document too large');
  } else {
    console.error('Document processing error:', error.message);
  }
}
```

### Format Detection

The document processor automatically detects formats:

```typescript
import { createDocumentProcessor } from 'openredaction';

const processor = createDocumentProcessor();

// Detect format from buffer
const format = processor.detectFormat(buffer);
console.log(format); // 'pdf', 'docx', 'txt', or null

// Check if format is supported (and peer dependency is installed)
if (processor.isFormatSupported('pdf')) {
  console.log('PDF processing is available');
} else {
  console.log('Install pdf-parse for PDF support');
}
```

### Standalone Document Processor

Use the document processor directly without PII detection:

```typescript
import { createDocumentProcessor } from 'openredaction';

const processor = createDocumentProcessor();

// Extract text only
const text = await processor.extractText(buffer);
console.log('Extracted text:', text);

// Get metadata
const metadata = await processor.getMetadata(buffer);
console.log('Pages:', metadata.pages);
console.log('Author:', metadata.author);
console.log('Created:', metadata.creationDate);
```

### Structured Data Processing (JSON, CSV, XLSX)

OpenRedaction provides specialized processors for structured data formats with path/cell tracking and field-level redaction:

#### JSON Processing

Detect and redact PII in JSON documents with nested object support:

```typescript
import { createJsonProcessor, createDetector } from 'openredaction';

const jsonProcessor = createJsonProcessor();
const detector = createDetector();

// Parse and detect PII in JSON
const jsonData = {
  user: {
    email: "john@example.com",
    ssn: "123-45-6789",
    address: "123 Main St"
  },
  contacts: [
    { name: "Jane Doe", phone: "555-123-4567" }
  ]
};

const result = jsonProcessor.detect(jsonData, detector);

console.log('Paths with PII:', result.pathsDetected);
// ['user.email', 'user.ssn', 'user.address', 'contacts[0].phone']

console.log('PII by path:', result.matchesByPath);
// {
//   'user.email': [{ type: 'EMAIL', value: 'john@example.com', ... }],
//   'user.ssn': [{ type: 'SSN', value: '123-45-6789', ... }],
//   ...
// }

// Redact with structure preservation
const redacted = jsonProcessor.redact(jsonData, result);
console.log(redacted);
// {
//   user: { email: '[REDACTED]', ssn: '[REDACTED]', address: '[REDACTED]' },
//   contacts: [{ name: 'Jane Doe', phone: '[REDACTED]' }]
// }
```

**JSON Options:**

```typescript
const result = jsonProcessor.detect(jsonData, detector, {
  maxDepth: 100,                    // Maximum nesting depth
  scanKeys: true,                   // Also scan object keys for PII
  alwaysRedact: ['user.password'],  // Always redact these paths
  skipPaths: ['metadata.id'],       // Skip these paths
  piiIndicatorKeys: ['email', 'ssn'], // Keys that indicate PII (boosts confidence)
  preserveStructure: true           // Keep JSON structure in redacted output
});
```

**JSON Lines (JSONL) Support:**

```typescript
// Process JSON Lines format (one JSON object per line)
const jsonLines = `
{"user": "john@example.com", "action": "login"}
{"user": "jane@example.com", "action": "logout"}
`;

const results = jsonProcessor.detectJsonLines(jsonLines, detector);
console.log(`Processed ${results.length} JSON documents`);
```

#### CSV Processing

Detect and redact PII in CSV files with column tracking:

```typescript
import { createCsvProcessor, createDetector } from 'openredaction';

const csvProcessor = createCsvProcessor();
const detector = createDetector();

// Parse and detect PII in CSV
const csvData = `
name,email,phone,city
John Doe,john@example.com,555-123-4567,Boston
Jane Smith,jane@example.com,555-987-6543,Seattle
`;

const result = csvProcessor.detect(csvData, detector);

console.log('Headers:', result.headers);
// ['name', 'email', 'phone', 'city']

console.log('Column stats:', result.columnStats);
// {
//   0: { columnIndex: 0, columnName: 'name', piiCount: 2, piiPercentage: 100, piiTypes: ['NAME'] },
//   1: { columnIndex: 1, columnName: 'email', piiCount: 2, piiPercentage: 100, piiTypes: ['EMAIL'] },
//   2: { columnIndex: 2, columnName: 'phone', piiCount: 2, piiPercentage: 100, piiTypes: ['PHONE'] },
//   ...
// }

console.log('Cell matches:', result.matchesByCell);
// [
//   { row: 0, column: 0, columnName: 'name', value: 'John Doe', matches: [...] },
//   { row: 0, column: 1, columnName: 'email', value: 'john@example.com', matches: [...] },
//   ...
// ]

// Redact CSV
const redactedCsv = csvProcessor.redact(csvData, result);
console.log(redactedCsv);
// name,email,phone,city
// [REDACTED],[REDACTED],[REDACTED],Boston
// [REDACTED],[REDACTED],[REDACTED],Seattle
```

**CSV Options:**

```typescript
const result = csvProcessor.detect(csvData, detector, {
  delimiter: ',',                     // Or auto-detect from ',', '\t', ';', '|'
  hasHeader: true,                    // Or auto-detect
  quote: '"',                         // Quote character
  skipEmptyLines: true,               // Skip empty lines
  maxRows: 10000,                     // Limit rows to process
  alwaysRedactColumns: [2],           // Always redact column indices
  alwaysRedactColumnNames: ['ssn'],   // Always redact columns by name
  skipColumns: [0],                   // Skip scanning these columns
  piiIndicatorNames: ['email', 'phone'] // Column names indicating PII
});
```

**Get CSV Info Without Detection:**

```typescript
const info = csvProcessor.getColumnInfo(csvData);
console.log(info);
// {
//   columnCount: 4,
//   rowCount: 2,
//   headers: ['name', 'email', 'phone', 'city'],
//   sampleRows: [['John Doe', 'john@example.com', ...], ...]
// }
```

#### XLSX (Excel) Processing

Detect and redact PII in Excel spreadsheets with multi-sheet and cell tracking:

```typescript
import { createXlsxProcessor, createDetector } from 'openredaction';
import fs from 'fs/promises';

const xlsxProcessor = createXlsxProcessor();
const detector = createDetector();

// Check if XLSX support is available
if (!xlsxProcessor.isAvailable()) {
  console.log('Install xlsx package: npm install xlsx');
  process.exit(1);
}

// Read Excel file
const buffer = await fs.readFile('employees.xlsx');

// Detect PII across all sheets
const result = xlsxProcessor.detect(buffer, detector);

console.log('Sheets processed:', result.sheetCount);
console.log('Total PII found:', result.piiCount);

// Iterate through sheets
for (const sheet of result.sheetResults) {
  console.log(`\nSheet: ${sheet.sheetName}`);
  console.log('  Rows:', sheet.rowCount);
  console.log('  Columns:', sheet.columnCount);
  console.log('  Headers:', sheet.headers);
  console.log('  PII found:', sheet.piiCount);

  // Column statistics
  for (const [colIndex, stats] of Object.entries(sheet.columnStats)) {
    console.log(`  Column ${stats.columnLetter} (${stats.columnName}):`);
    console.log(`    PII instances: ${stats.piiCount}`);
    console.log(`    PII in ${stats.piiPercentage.toFixed(1)}% of rows`);
    console.log(`    Types: ${stats.piiTypes.join(', ')}`);
  }

  // Cell-level matches
  for (const cellMatch of sheet.matchesByCell) {
    console.log(`  Cell ${cellMatch.cell}: ${cellMatch.value}`);
    console.log(`    PII: ${cellMatch.matches.map(m => m.type).join(', ')}`);
  }
}

// Redact and save
const redactedBuffer = xlsxProcessor.redact(buffer, result);
await fs.writeFile('employees-redacted.xlsx', redactedBuffer);
```

**XLSX Options:**

```typescript
const result = xlsxProcessor.detect(buffer, detector, {
  sheets: ['Employee Data'],          // Process specific sheets by name
  sheetIndices: [0, 1],              // Or by index (0-based)
  hasHeader: true,                    // Or auto-detect
  maxRows: 10000,                     // Limit rows per sheet
  alwaysRedactColumns: [2],           // Always redact column indices
  alwaysRedactColumnNames: ['SSN'],   // Always redact columns by name
  skipColumns: [0],                   // Skip scanning these columns
  piiIndicatorNames: ['email', 'phone'], // Column names indicating PII
  preserveFormatting: true,           // Keep cell formatting
  preserveFormulas: true              // Keep formulas (redact values only)
});
```

**Get Excel Metadata:**

```typescript
const metadata = xlsxProcessor.getMetadata(buffer);
console.log('Sheets:', metadata.sheetNames);
console.log('Sheet count:', metadata.sheetCount);
```

#### Using Structured Data with DocumentProcessor

The main `DocumentProcessor` automatically detects and processes structured formats:

```typescript
import { createDocumentProcessor } from 'openredaction';

const processor = createDocumentProcessor();

// Auto-detect JSON
const jsonBuffer = Buffer.from(JSON.stringify({ email: "test@example.com" }));
const jsonText = await processor.extractText(jsonBuffer);

// Auto-detect CSV
const csvBuffer = Buffer.from('name,email\nJohn,john@example.com');
const csvText = await processor.extractText(csvBuffer);

// For XLSX (requires 'xlsx' package)
const xlsxBuffer = await fs.readFile('data.xlsx');
const xlsxText = await processor.extractText(xlsxBuffer);

// Get metadata
const metadata = await processor.getMetadata(jsonBuffer);
console.log(metadata.format); // 'json'
console.log(metadata.custom); // { isArray: false, itemCount: 1 }
```

**Access individual processors:**

```typescript
const processor = createDocumentProcessor();

// Get processors for advanced usage
const jsonProc = processor.getJsonProcessor();
const csvProc = processor.getCsvProcessor();
const xlsxProc = processor.getXlsxProcessor();

// Use with custom detector
import { createDetector } from 'openredaction';
const detector = createDetector({ patterns: ['EMAIL', 'PHONE'] });

const result = jsonProc.detect(data, detector, { scanKeys: true });
```

### OCR (Optical Character Recognition)

Extract text from images and scanned documents with built-in OCR support:

#### Installation

OCR requires an additional optional peer dependency:

```bash
npm install tesseract.js
```

#### Supported Formats

- **PNG** - Lossless image format
- **JPEG/JPG** - Compressed image format
- **TIFF** - High-quality scanned documents
- **BMP** - Windows bitmap images
- **WebP** - Modern web image format

#### Basic OCR Usage

```typescript
import { OpenRedaction } from 'openredaction';
import fs from 'fs/promises';

const redactor = new OpenRedaction();

// Process image with OCR
const imageBuffer = await fs.readFile('scanned-document.png');
const result = await redactor.detectDocument(imageBuffer, {
  enableOCR: true
});

console.log('Extracted text:', result.text);
console.log('OCR confidence:', result.metadata.ocrConfidence);
console.log('Found PII:', result.detection.detections);
```

#### OCR Language Support

Configure OCR for different languages:

```typescript
import { OpenRedaction } from 'openredaction';

const redactor = new OpenRedaction();

// English (default)
await redactor.detectDocument(imageBuffer, {
  enableOCR: true,
  ocrOptions: {
    language: 'eng'
  }
});

// Spanish
await redactor.detectDocument(imageBuffer, {
  enableOCR: true,
  ocrOptions: {
    language: 'spa'
  }
});

// Multiple languages
await redactor.detectDocument(imageBuffer, {
  enableOCR: true,
  ocrOptions: {
    language: ['eng', 'spa', 'fra']  // English, Spanish, French
  }
});

// Supported languages:
// - eng (English)
// - spa (Spanish)
// - fra (French)
// - deu (German)
// - por (Portuguese)
// - ita (Italian)
// - rus (Russian)
// - chi_sim (Chinese Simplified)
// - chi_tra (Chinese Traditional)
// - jpn (Japanese)
// - kor (Korean)
```

#### OCR Quality Settings

Fine-tune OCR for better accuracy:

```typescript
await redactor.detectDocument(imageBuffer, {
  enableOCR: true,
  ocrOptions: {
    language: 'eng',
    oem: 3,  // OCR Engine Mode (0-3, default: 3 for best accuracy)
    psm: 3   // Page Segmentation Mode (0-13, default: 3 for automatic)
  }
});

// OCR Engine Modes (oem):
// 0 - Legacy engine only
// 1 - Neural nets LSTM engine only
// 2 - Legacy + LSTM engines
// 3 - Default, based on what is available (recommended)

// Page Segmentation Modes (psm):
// 0  - Orientation and script detection (OSD) only
// 1  - Automatic page segmentation with OSD
// 2  - Automatic page segmentation (no OSD or OCR)
// 3  - Fully automatic page segmentation (default)
// 4  - Assume a single column of text of variable sizes
// 6  - Assume a single uniform block of text
// 11 - Sparse text (find as much text as possible)
// 13 - Raw line (treat image as single text line)
```

#### Standalone OCR Processor

Use OCR directly without document processing:

```typescript
import { createOCRProcessor } from 'openredaction';

const ocrProcessor = createOCRProcessor();

// Check if OCR is available
if (ocrProcessor.isAvailable()) {
  // Process single image
  const result = await ocrProcessor.recognizeText(imageBuffer, {
    language: 'eng',
    oem: 3,
    psm: 3
  });

  console.log('Text:', result.text);
  console.log('Confidence:', result.confidence);
  console.log('Processing time:', result.processingTime, 'ms');
}
```

#### Batch OCR Processing

Process multiple images efficiently:

```typescript
import { createOCRProcessor } from 'openredaction';
import { glob } from 'glob';
import fs from 'fs/promises';

const ocrProcessor = createOCRProcessor();

// Find all images
const imageFiles = await glob('scans/**/*.{png,jpg,jpeg}');

// Load buffers
const buffers = await Promise.all(
  imageFiles.map(file => fs.readFile(file))
);

// Batch process with scheduler (more efficient)
const results = await ocrProcessor.recognizeBatch(buffers, {
  language: 'eng'
});

// Process results
results.forEach((result, index) => {
  console.log(`File: ${imageFiles[index]}`);
  console.log(`Confidence: ${result.confidence}%`);
  console.log(`Text: ${result.text.substring(0, 100)}...`);
  console.log('---');
});

// Don't forget to cleanup
await ocrProcessor.cleanup();
```

#### OCR with Document Processing

Combine OCR with full document processing:

```typescript
import { OpenRedaction } from 'openredaction';
import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const redactor = new OpenRedaction();

app.post('/api/scan-document', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await redactor.detectDocument(req.file.buffer, {
      enableOCR: true,
      ocrOptions: {
        language: req.body.language || 'eng'
      }
    });

    res.json({
      extractedText: result.text,
      ocrConfidence: result.metadata.ocrConfidence,
      piiFound: result.detection.detections.length,
      redactedText: result.detection.redacted,
      detections: result.detection.detections.map(d => ({
        type: d.type,
        severity: d.severity,
        position: d.position
      }))
    });
  } catch (error) {
    if (error.message.includes('tesseract.js')) {
      res.status(500).json({
        error: 'OCR not available. Install tesseract.js: npm install tesseract.js'
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(3000);
```

#### Performance Tips

1. **Use Batch Processing**: For multiple images, use `recognizeBatch()` with a scheduler
2. **Optimize Image Quality**: Higher resolution images = better OCR but slower processing
3. **Pre-process Images**: Enhance contrast, remove noise, straighten for better accuracy
4. **Choose Appropriate PSM**: Use PSM 6 for single blocks, PSM 11 for sparse text
5. **Language Selection**: Only load languages you need to reduce memory usage

## Worker Threads (Parallel Processing)

Process multiple texts or documents in parallel using worker threads for maximum performance:

### Batch Text Processing

Process multiple texts in parallel:

```typescript
import { OpenRedaction } from 'openredaction';

// Process array of texts in parallel
const texts = [
  "Email: john@example.com",
  "SSN: 123-45-6789",
  "Phone: 555-123-4567",
  // ... hundreds or thousands of texts
];

// Automatically uses all CPU cores
const results = await OpenRedaction.detectBatch(texts);

// Custom worker count
const results = await OpenRedaction.detectBatch(texts, {
  numWorkers: 4  // Use 4 worker threads
});

console.log(`Processed ${results.length} texts`);
results.forEach((result, index) => {
  console.log(`Text ${index}: Found ${result.detections.length} PII items`);
});
```

### Batch Document Processing

Process multiple documents in parallel:

```typescript
import { OpenRedaction } from 'openredaction';
import { glob } from 'glob';
import fs from 'fs/promises';

// Find all documents
const files = await glob('documents/**/*.{pdf,docx,png,jpg}');

// Load buffers
const buffers = await Promise.all(
  files.map(file => fs.readFile(file))
);

// Process all documents in parallel
const results = await OpenRedaction.detectDocumentsBatch(buffers, {
  enableOCR: true,  // Enable OCR for images
  numWorkers: 8     // Use 8 workers
});

// Process results
results.forEach((result, index) => {
  console.log(`File: ${files[index]}`);
  console.log(`Format: ${result.metadata.format}`);
  console.log(`PII Found: ${result.detection.detections.length}`);
  console.log(`Processing Time: ${result.extractionTime}ms`);
});
```

### Manual Worker Pool Management

For advanced use cases, manage worker pools manually:

```typescript
import { createWorkerPool } from 'openredaction';

// Create worker pool
const pool = createWorkerPool({
  numWorkers: 4,           // Number of workers
  maxQueueSize: 100,       // Maximum queue size
  idleTimeout: 30000       // Worker idle timeout (ms)
});

// Initialize workers
await pool.initialize();

// Submit tasks
const tasks = texts.map((text, index) => ({
  type: 'detect' as const,
  id: `task_${index}`,
  text,
  options: { preset: 'gdpr' }
}));

// Process tasks
const results = await Promise.all(
  tasks.map(task => pool.execute(task))
);

// Get statistics
const stats = pool.getStats();
console.log(`Active Workers: ${stats.activeWorkers}`);
console.log(`Queue Size: ${stats.queueSize}`);
console.log(`Total Processed: ${stats.totalProcessed}`);
console.log(`Avg Processing Time: ${stats.avgProcessingTime}ms`);

// Clean up
await pool.terminate();
```

### Performance Benefits

Worker threads provide significant performance improvements:

```typescript
import { OpenRedaction } from 'openredaction';

const texts = Array(1000).fill("Email: test@example.com, SSN: 123-45-6789");

// Sequential processing (slow)
console.time('Sequential');
const redactor = new OpenRedaction();
const sequentialResults = texts.map(text => redactor.detect(text));
console.timeEnd('Sequential');
// Sequential: ~5000ms

// Parallel processing (fast)
console.time('Parallel');
const parallelResults = await OpenRedaction.detectBatch(texts);
console.timeEnd('Parallel');
// Parallel: ~700ms (7x faster on 8-core CPU)
```

### Best Practices

1. **Use Batch Methods**: For multiple texts/documents, always use `detectBatch()` or `detectDocumentsBatch()`
2. **Optimal Worker Count**: Default (CPU count) is usually optimal. Adjust based on workload
3. **Memory Considerations**: Each worker uses memory. Don't create too many workers for large documents
4. **Queue Management**: Set `maxQueueSize` to prevent memory issues with huge batches
5. **Cleanup**: Worker pools auto-terminate after batch methods complete

## CLI Usage

```bash
# Detect and redact PII
openredaction detect "Email john@example.com"

# Scan and show severity breakdown
openredaction scan "Contact john@example.com or call 555-123-4567"

# Use compliance preset
openredaction detect "SSN: 123-45-6789" --preset hipaa

# JSON output
openredaction detect "Card: 4532015112830366" --json

# Filter patterns
openredaction detect "Text here" --patterns EMAIL,PHONE_US
```

## Local Learning System

OpenRedaction includes a local learning system that improves accuracy over time by learning from your feedback - no backend required!

### Features

- **Privacy-First** - All learning data stays local on your machine
- **Auto-Whitelisting** - High-confidence false positives are automatically whitelisted
- **Pattern Adjustments** - Tracks missed detections for pattern improvements
- **Import/Export** - Share learned patterns across teams or projects
- **Config File Support** - Persistent configuration with `.openredaction.config.js`

### Quick Start with Learning

```typescript
import { OpenRedaction } from 'openredaction';

const redactor = new OpenRedaction({
  enableLearning: true,  // Default: true
  learningStorePath: '.openredaction/learnings.json'
});

// Use as normal
const result = redactor.detect("Contact API support");

// Record false positive (incorrectly flagged as PII)
const apiDetection = result.detections.find(d => d.value === 'API');
if (apiDetection) {
  redactor.recordFalsePositive(apiDetection, "in API documentation");
  // After 5+ similar reports, "API" is auto-whitelisted!
}

// Record false negative (missed PII)
redactor.recordFalseNegative("secret123", "INTERNAL_ID", "password context");

// View learning statistics
const stats = redactor.getLearningStats();
console.log(`Accuracy: ${(stats.accuracy * 100).toFixed(2)}%`);
console.log(`False Positives: ${stats.falsePositives}`);

// Export learned patterns for sharing
const learnings = redactor.exportLearnings({ minConfidence: 0.8 });
fs.writeFileSync('learned-patterns.json', JSON.stringify(learnings));

// Import learned patterns
const sharedLearnings = JSON.parse(fs.readFileSync('team-patterns.json'));
redactor.importLearnings(sharedLearnings, true); // merge=true
```

### CLI Learning Commands

```bash
# Initialize config file
openredaction init

# Record false positive
openredaction feedback false-positive "API" --type NAME --context "Call the API"

# Record false negative
openredaction feedback false-negative "EMP-123456" --type EMPLOYEE_ID

# View statistics
openredaction stats

# Export learned patterns
openredaction export > learned-patterns.json

# Import learned patterns
openredaction import team-patterns.json
```

### Config File

Create `.openredaction.config.js` for persistent configuration:

```javascript
export default {
  // Extend built-in presets
  extends: ['openredaction:recommended'],

  // Detection options
  includeNames: true,
  includeAddresses: true,
  includePhones: true,
  includeEmails: true,
  deterministic: true,

  // Whitelist
  whitelist: [
    'Example Corp',
    'API',
    'CEO'
  ],

  // Custom patterns
  customPatterns: [
    {
      name: 'INTERNAL_ID',
      regex: /INT-\d{6}/g,
      category: 'personal',
      priority: 90
    }
  ],

  // Learning configuration
  learnedPatterns: '.openredaction/learnings.json',
  learningOptions: {
    autoSave: true,
    confidenceThreshold: 0.85
  }
};
```

Then load it:

```typescript
import { OpenRedaction } from 'openredaction';

// Auto-loads from .openredaction.config.js
const redactor = await OpenRedaction.fromConfig();
```

### Available Presets

- `openredaction:recommended` - Balanced detection with all categories
- `openredaction:strict` - Maximum detection (GDPR mode)
- `openredaction:minimal` - Only emails and phones
- `openredaction:gdpr` - GDPR compliance preset
- `openredaction:hipaa` - HIPAA compliance preset
- `openredaction:ccpa` - CCPA compliance preset

### Integration with Disclosurely

Perfect for building a private learning loop:

```typescript
// In your Disclosurely backend
import { OpenRedaction, LocalLearningStore } from 'openredaction';

const learningStore = new LocalLearningStore('./data/pii-learnings.json');
const redactor = new OpenRedaction({
  enableLearning: true,
  learningStorePath: './data/pii-learnings.json'
});

// Process documents
app.post('/api/documents/process', async (req, res) => {
  const result = redactor.detect(req.body.text);
  res.json(result);
});

// User feedback endpoint
app.post('/api/pii/feedback', async (req, res) => {
  const { detection, isFalsePositive, context } = req.body;

  if (isFalsePositive) {
    redactor.recordFalsePositive(detection, context);
  } else {
    redactor.recordFalseNegative(detection.value, detection.type, context);
  }

  res.json({ success: true });
});

// Periodic: export generic learnings to contribute back
setInterval(async () => {
  const learnings = redactor.exportLearnings({
    minConfidence: 0.9,
    includeContexts: false // privacy
  });

  // Create PR to OpenRedaction with improvements
  await contributeLearnings(learnings);
}, 7 * 24 * 60 * 60 * 1000); // Weekly
```

## Supported PII Types

### Personal Information
- **EMAIL** - Email addresses
- **NAME** - Person names (2-3 parts)
- **EMPLOYEE_ID** - Employee identification numbers
- **USERNAME** - Usernames and login IDs
- **DATE_OF_BIRTH** - Birth dates

### Financial
- **CREDIT_CARD** - Credit card numbers (with Luhn validation)
- **IBAN** - International Bank Account Numbers (with checksum)
- **BANK_ACCOUNT_UK** - UK bank account numbers
- **SORT_CODE_UK** - UK sort codes
- **ROUTING_NUMBER_US** - US routing numbers
- **CVV** - Card security codes

### Government IDs
- **SSN** - US Social Security Numbers (with validation)
- **PASSPORT_UK** - UK passport numbers
- **PASSPORT_US** - US passport numbers
- **NATIONAL_INSURANCE_UK** - UK National Insurance (with validation)
- **NHS_NUMBER** - UK NHS numbers (with checksum validation)
- **DRIVING_LICENSE_UK** - UK driving licenses
- **DRIVING_LICENSE_US** - US driving licenses
- **TAX_ID** - Tax identification numbers

### Contact Information
- **PHONE_UK_MOBILE** - UK mobile phones
- **PHONE_UK** - UK landline phones
- **PHONE_US** - US phone numbers
- **PHONE_INTERNATIONAL** - International phone numbers
- **POSTCODE_UK** - UK postcodes
- **ZIP_CODE_US** - US ZIP codes
- **ADDRESS_STREET** - Street addresses
- **ADDRESS_PO_BOX** - PO Box addresses

### Network & IoT
- **IPV4** - IPv4 addresses (excluding private IPs)
- **IPV6** - IPv6 addresses (excluding local)
- **MAC_ADDRESS** - MAC addresses
- **URL_WITH_AUTH** - URLs with embedded credentials
- **IOT_SERIAL_NUMBER** - IoT device serial numbers
- **DEVICE_UUID** - Device UUID identifiers

## Industry-Specific Identifiers

OpenRedaction supports 180+ industry-specific PII patterns across multiple sectors:

### Education & Academia
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| STUDENT_ID | S1234567 | Student identification numbers |
| EXAM_REGISTRATION_NUMBER | EXAM-2024-5678 | Exam registration numbers |
| UNIVERSITY_ID | UNI-ABC123456 | University and college IDs |
| TRANSCRIPT_ID | TRANSCRIPT-2024001 | Academic transcript identifiers |
| FACULTY_ID | F1234567 | Faculty and teacher IDs |

### Insurance & Claims
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| CLAIM_ID | CLAIM-12345678 | Insurance claim IDs |
| POLICY_NUMBER | POLICY-ABC123456 | Insurance policy numbers |
| POLICY_HOLDER_ID | PH-A12345678 | Policy holder identifiers |
| QUOTE_REFERENCE | QTE-REF-2024001 | Insurance quote references |
| ADJUSTER_ID | ADJ-123456 | Insurance adjuster IDs |

### Retail & E-Commerce
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| ORDER_NUMBER | ORD-1234567890 | E-commerce order numbers |
| LOYALTY_CARD_NUMBER | LOYALTY-1234567890123 | Customer loyalty card numbers |
| DEVICE_ID_TAG | DEVID:1234567890ABCDEF | Device identification tags |
| GIFT_CARD_NUMBER | GC-1234567890123 | Gift card numbers |
| RMA_NUMBER | RMA-ABC123456 | Return merchandise authorization |

### Telecommunications & Utilities
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| TELECOMS_ACCOUNT_NUMBER | ACC-123456789 | Customer account numbers |
| METER_SERIAL_NUMBER | MTR-1234567890 | Utility meter serial numbers |
| IMSI_NUMBER | IMSI-123456789012345 | International Mobile Subscriber Identity |
| IMEI_NUMBER | IMEI-123456789012345 | Mobile equipment identity numbers |
| SIM_CARD_NUMBER | SIM-12345678901234567890 | SIM card identification |

### Legal & Professional Services
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| CASE_NUMBER | CASE-AB-2024-123456 | Court case and docket numbers |
| CONTRACT_REFERENCE | CNTR-12345678 | Contract reference codes |
| MATTER_NUMBER | MATTER-ABC123456 | Law firm matter numbers |
| BAR_NUMBER | BAR-123456 | Attorney bar registration |
| CLIENT_ID | CLIENT-ABC123 | Law firm client identifiers |

### Manufacturing & Supply Chain
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| SUPPLIER_ID | SUPP-AB12345 | Supplier identification |
| PART_NUMBER | PN-ABC12345 | Part numbers with sensitive pricing |
| PURCHASE_ORDER_NUMBER | PO-ABC123456 | Purchase order numbers |
| BATCH_LOT_NUMBER | BATCH-2024001 | Batch and lot numbers |
| CONTAINER_NUMBER | ABCD1234567 | Shipping container numbers |

### Finance & Banking
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| UK_BANK_ACCOUNT_IBAN | GB82WEST12345698765432 | UK bank account (IBAN format) |
| UK_SORT_CODE_ACCOUNT | 12-34-56 12345678 | UK sort code + account combo |
| SWIFT_BIC | ABCDGB2L | SWIFT/BIC codes |
| BITCOIN_ADDRESS | 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa | Bitcoin cryptocurrency addresses |
| ETHEREUM_ADDRESS | 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb | Ethereum addresses |

### Transportation & Automotive
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| VIN | VIN-1HGBH41JXMN109186 | Vehicle Identification Number |
| LICENSE_PLATE | LICENSE-ABC123 | Vehicle license plate numbers |
| FLEET_VEHICLE_ID | FLEET-V12345 | Fleet vehicle IDs |
| DRIVER_ID | DRIVER-D12345 | Driver identification numbers |
| TRIP_ID | TRIP-ABC123456789 | Trip and ride IDs |

### Media & Publishing
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| INTERVIEWEE_ID | INTV-A12345 | Interviewee identification for anonymity |
| SOURCE_ID | SOURCE-ABC123 | Confidential source identifiers |
| MANUSCRIPT_ID | MS-2024001 | Manuscript identification |
| PRESS_PASS_ID | PRESS-ABC123 | Press pass and media credentials |
| SUBSCRIBER_ID | SUBSCRIBER-ABC12345 | Subscriber identification |

### Human Resources & Recruitment
| Identifier Type | Example Format | Description |
|----------------|----------------|-------------|
| EMPLOYEE_ID | EMP-123456 | Employee identification numbers |
| PAYROLL_NUMBER | PAYROLL-ABC123 | Payroll identification |
| SALARY_AMOUNT | Salary: £45,000 | Salary and compensation amounts |
| BENEFITS_PLAN_NUMBER | BENEFITS-ABC12345 | Employee benefits plan numbers |
| RETIREMENT_ACCOUNT | 401K-ABC12345678 | Retirement account numbers |

> 📖 See [examples/industry-examples.md](examples/industry-examples.md) for comprehensive usage examples.

## Configuration Options

```typescript
const shield = new OpenRedaction({
  // Category toggles
  includeNames: true,        // Default: true
  includeEmails: true,       // Default: true
  includePhones: true,       // Default: true
  includeAddresses: true,    // Default: true

  // Pattern whitelist (only detect these)
  patterns: ['EMAIL', 'PHONE_US', 'SSN'],

  // Custom patterns
  customPatterns: [{
    type: 'CUSTOM_ID',
    regex: /CUSTOM-\d{6}/g,
    priority: 100,
    placeholder: '[CUSTOM_{n}]',
    severity: 'high'
  }],

  // Whitelist (skip these values)
  whitelist: ['example.com', 'test@company.com'],

  // Deterministic placeholders
  deterministic: true,       // Default: true

  // Compliance preset
  preset: 'gdpr' // or 'hipaa', 'ccpa'
});
```

## Compliance Presets

### GDPR (European Union)
```typescript
const shield = new OpenRedaction({ preset: 'gdpr' });
```
Detects: Email, names, UK/EU phones, addresses, passports, IBAN, credit cards

### HIPAA (US Healthcare)
```typescript
const shield = new OpenRedaction({ preset: 'hipaa' });
```
Detects: Email, names, SSN, US phones, addresses, dates of birth, medical IDs

### CCPA (California)
```typescript
const shield = new OpenRedaction({ preset: 'ccpa' });
```
Detects: Email, names, SSN, US phones, addresses, IP addresses, usernames

## Advanced Usage

### Severity-Based Scanning

```typescript
const scan = shield.scan(text);

console.log(`High severity: ${scan.high.length}`);    // SSN, credit cards, etc.
console.log(`Medium severity: ${scan.medium.length}`); // Phone numbers, addresses
console.log(`Low severity: ${scan.low.length}`);       // ZIP codes, postcodes
```

### Get Active Patterns

```typescript
const patterns = shield.getPatterns();
console.log(patterns.map(p => p.type));
```

### Performance Stats

```typescript
const result = shield.detect(text);
console.log(`Processed in ${result.stats.processingTime}ms`);
console.log(`Found ${result.stats.piiCount} PII instances`);
```

## Architecture

OpenRedaction uses a priority-based pattern matching system with built-in validators:

1. **Patterns** - Each PII type has a regex pattern and priority (higher = checked first)
2. **Validators** - Optional validation functions (e.g., Luhn for credit cards, mod-97 for IBAN)
3. **Context-Aware** - False positive filtering based on surrounding text
4. **Deterministic Hashing** - FNV-1a hash for consistent placeholder generation

## Performance

- **Speed**: 10-20ms for 2-3KB of text
- **Accuracy**: 96%+ detection rate, <1% false positives
- **Memory**: Low memory footprint, no external dependencies
- **Scalability**: Designed for high-throughput applications

## Browser Support

OpenRedaction works in all modern browsers and Node.js 20+:

```typescript
import { OpenRedaction } from 'openredaction';
// Works in both Node.js and browsers
```

## Testing

```bash
npm test                # Run tests
npm run test:coverage   # Run with coverage
npm run test:watch      # Watch mode
```

Current coverage: **98.98%** (lines), **91.03%** (branches)

## Development

```bash
npm install      # Install dependencies
npm run build    # Build library and CLI
npm run dev      # Watch mode
npm run lint     # Type check
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © 2025

## Roadmap

### Completed ✅
- [x] 558+ PII patterns across 25+ industries and 50+ countries
- [x] All 50 US state license plates with format-specific validation
- [x] 16 international carrier tracking numbers (global coverage)
- [x] Multiple redaction modes (5 modes: placeholder, mask-middle, mask-all, format-preserving, token-replace)
- [x] Audit logging system with JSON/CSV export
- [x] Metrics export API (Prometheus, StatsD) for monitoring
- [x] RBAC (role-based access control) for enterprise multi-tenancy
- [x] Document processing (PDF, DOCX, TXT, JSON, CSV, XLSX) with text extraction
- [x] **Structured data support (JSON, CSV, XLSX)** with path/cell tracking - Phase 1 ✨
- [x] OCR integration for image-based documents (11 languages, batch processing)
- [x] Worker threads for parallel processing (batch text and document processing)
- [x] Local learning system with feedback loop
- [x] Context-aware detection with confidence scoring
- [x] Priority optimization system
- [x] Streaming API for large texts
- [x] HTML report generation
- [x] Framework integrations (React hooks, Express middleware)

### Planned 📋
- [ ] Multi-language support (Spanish, French, German, Portuguese)
- [ ] Framework integrations (LangChain, Vercel AI SDK)
- [ ] Cloud API with managed service
- [ ] Interactive playground website

## Links

- [GitHub Repository](https://github.com/sam247/openredact)
- [npm Package](https://www.npmjs.com/package/openredact) (Coming Soon)
- [Report Issues](https://github.com/sam247/openredact/issues)

---

Built with ❤️ for developers who care about privacy
