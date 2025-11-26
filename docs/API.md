# OpenRedaction API Reference

Complete API documentation for the OpenRedaction library.

## Table of Contents

- [OpenRedaction Class](#openredaction-class)
  - [Constructor](#constructor)
  - [Detection Methods](#detection-methods)
  - [Utility Methods](#utility-methods)
  - [Learning Methods](#learning-methods)
  - [Configuration Methods](#configuration-methods)
- [Core Types](#core-types)
- [Patterns](#patterns)
- [Utilities](#utilities)

## OpenRedaction Class

The main class for PII detection and redaction.

### Constructor

```typescript
new OpenRedaction(options?: OpenRedactionOptions)
```

Creates a new detector instance with the specified configuration.

**Parameters:**
- `options` - Configuration options (optional)

**Example:**
```typescript
import { OpenRedaction } from 'openredaction';

// Basic usage with defaults
const detector = new OpenRedaction();

// GDPR-compliant configuration
const gdprDetector = new OpenRedaction({
  preset: 'gdpr',
  redactionMode: 'hash',
  deterministic: true
});

// Performance-optimized for emails and phones only
const fastDetector = new OpenRedaction({
  categories: ['contact'],  // 97.8% faster
  enableCache: true,
  cacheSize: 1000
});

// Advanced features enabled
const advancedDetector = new OpenRedaction({
  enableContextAnalysis: true,
  enableFalsePositiveFilter: true,
  enableMultiPass: true,
  confidenceThreshold: 0.7,
  enableLearning: true
});
```

**See:** [OpenRedactionOptions](#openredactionoptions)

---

### Detection Methods

#### `detect(text: string): DetectionResult`

Detect PII in text and return detailed results with redacted version.

**Parameters:**
- `text` - The text to scan for PII

**Returns:** `DetectionResult` - Complete detection results

**Throws:**
- Error if text exceeds `maxInputSize` limit
- Error if RBAC permission denied (when RBAC enabled)

**Example:**
```typescript
const result = detector.detect('Email me at john@example.com');

console.log(result.piiFound);    // true
console.log(result.piiCount);    // 1
console.log(result.redacted);    // 'Email me at [EMAIL_1]'
console.log(result.detections[0].type);  // 'EMAIL_ADDRESS'
console.log(result.detections[0].value); // 'john@example.com'
console.log(result.detections[0].confidence); // 0.95
```

**See:** [DetectionResult](#detectionresult)

---

#### `scan(text: string): ScanResult`

Scan text and categorize detections by severity level.

**Parameters:**
- `text` - The text to scan

**Returns:** Object with detections grouped by severity

**Example:**
```typescript
const results = detector.scan('SSN: 123-45-6789, Email: test@example.com');

console.log(`High severity: ${results.high.length}`);    // 1 (SSN)
console.log(`Medium severity: ${results.medium.length}`); // 1 (Email)
console.log(`Total PII: ${results.total}`);               // 2

// Process high-severity findings first
results.high.forEach(detection => {
  console.log(`CRITICAL: ${detection.type} at position ${detection.position}`);
});
```

---

### Utility Methods

#### `getPatterns(): PIIPattern[]`

Get the list of all active PII patterns.

**Returns:** Array of active patterns

**Example:**
```typescript
const patterns = detector.getPatterns();
console.log(`Active patterns: ${patterns.length}`);
console.log(`Pattern types: ${patterns.map(p => p.type).join(', ')}`);
```

---

#### `getCacheStats(): CacheStats`

Get result cache statistics.

**Returns:** Cache statistics object

**Example:**
```typescript
const detector = new OpenRedaction({ enableCache: true, cacheSize: 100 });

detector.detect('test1@example.com');
detector.detect('test2@example.com');

const stats = detector.getCacheStats();
console.log(`Cache: ${stats.size}/${stats.maxSize} entries`);
console.log(`Cache enabled: ${stats.enabled}`);
```

---

#### `explain(): ExplainAPI`

Create an ExplainAPI instance for debugging pattern matching.

**Returns:** ExplainAPI instance

**Example:**
```typescript
const explainer = detector.explain();

// Why was this detected?
const explanation = explainer.explainText('john@example.com');
console.log(explanation.matches);  // Patterns that matched
console.log(explanation.reasons);  // Why each pattern matched

// Test specific pattern
const test = explainer.testPattern('EMAIL_ADDRESS', 'test@example.com');
console.log(`Matched: ${test.matched}`);
```

---

#### `generateReport(result: DetectionResult, options: ReportOptions): string`

Generate formatted report from detection results.

**Parameters:**
- `result` - Detection result to generate report from
- `options` - Report format and options

**Returns:** Formatted report string

**Example:**
```typescript
const result = detector.detect('Email: john@example.com, SSN: 123-45-6789');

// Text report
const textReport = detector.generateReport(result, {
  format: 'text',
  includeStats: true,
  includeSummary: true
});

// JSON report for APIs
const jsonReport = detector.generateReport(result, {
  format: 'json',
  includeMetadata: true
});

// CSV for spreadsheets
const csvReport = detector.generateReport(result, {
  format: 'csv',
  groupByType: true
});
```

---

### Learning Methods

#### `recordFalsePositive(detection: PIIDetection, context?: string): void`

Report a false positive detection for learning.

**Parameters:**
- `detection` - The incorrectly flagged detection
- `context` - Optional context explaining why it's false

**Throws:** Error if learning is disabled

**Example:**
```typescript
const result = detector.detect('Download file.pdf');

if (result.detections[0].value === 'file.pdf') {
  detector.recordFalsePositive(
    result.detections[0],
    'Generic file extension, not sensitive'
  );
}

// After enough reports, it will be auto-whitelisted
```

---

#### `recordFalseNegative(text: string, expectedType: string, context?: string): void`

Report missed PII that should have been detected.

**Example:**
```typescript
detector.recordFalseNegative(
  'employee-12345',
  'EMPLOYEE_ID',
  'Should detect employee IDs'
);
```

---

#### `getLearningStats(): LearningStats | null`

Get learning system statistics.

**Returns:** Learning stats or null if disabled

---

### Configuration Methods

#### `exportConfig(metadata?): ExportedConfig`

Export current configuration for sharing/version control.

**Example:**
```typescript
const config = detector.exportConfig({
  description: 'Production GDPR config',
  author: 'Security Team',
  tags: ['gdpr', 'production']
});

// Save to file
fs.writeFileSync('gdpr-config.json', JSON.stringify(config, null, 2));
```

---

## Core Types

### OpenRedactionOptions

Configuration options for the detector.

```typescript
interface OpenRedactionOptions {
  // Compliance
  preset?: 'gdpr' | 'hipaa' | 'ccpa';

  // Pattern selection
  includeNames?: boolean;           // default: true
  includeAddresses?: boolean;       // default: true
  includePhones?: boolean;          // default: true
  includeEmails?: boolean;          // default: true
  patterns?: string[];              // Whitelist specific patterns
  categories?: string[];            // Filter by category (performance)
  customPatterns?: PIIPattern[];    // Add custom patterns

  // Redaction
  redactionMode?: RedactionMode;    // default: 'placeholder'
  deterministic?: boolean;          // default: true
  whitelist?: string[];             // Values to ignore

  // Performance
  enableCache?: boolean;            // default: false
  cacheSize?: number;               // default: 100
  maxInputSize?: number;            // default: 10MB
  regexTimeout?: number;            // default: 100ms

  // Accuracy
  enableContextAnalysis?: boolean;  // default: true
  confidenceThreshold?: number;     // default: 0.5
  enableFalsePositiveFilter?: boolean; // default: false
  enableMultiPass?: boolean;        // default: false
  multiPassCount?: number;          // default: 3

  // Learning
  enableLearning?: boolean;         // default: true

  // Debugging
  debug?: boolean;                  // default: false
}
```

**Example:**
```typescript
const options: OpenRedactionOptions = {
  preset: 'gdpr',
  categories: ['personal', 'contact'],
  enableCache: true,
  enableContextAnalysis: true,
  confidenceThreshold: 0.7
};
```

---

### DetectionResult

Complete PII detection result returned by `detect()`.

```typescript
interface DetectionResult {
  original: string;                  // Original text
  redacted: string;                  // Redacted version
  detections: PIIDetection[];        // All detected PII
  redactionMap: Record<string, string>; // Reverse map
  stats?: {
    processingTime?: number;         // ms
    piiCount: number;                // Total count
  };
}
```

**Convenience properties:**
```typescript
result.piiFound    // boolean - any PII found?
result.piiCount    // number - total PII count
result.piiTypes    // string[] - unique PII types
```

---

### PIIDetection

Individual PII detection with metadata.

```typescript
interface PIIDetection {
  type: string;                      // e.g., 'EMAIL_ADDRESS'
  value: string;                     // Original value
  placeholder: string;               // e.g., '[EMAIL_1]'
  position: [number, number];        // [start, end]
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence?: number;               // 0-1
}
```

---

### PIIPattern

Pattern definition for custom detection.

```typescript
interface PIIPattern {
  type: string;                      // Pattern identifier
  regex: RegExp;                     // Matching regex
  priority: number;                  // Detection order (higher = first)
  placeholder: string;               // Template for redaction
  severity?: 'critical' | 'high' | 'medium' | 'low';
  description?: string;
  validator?: (match: string, context: string) => boolean;
}
```

**Example:**
```typescript
const employeePattern: PIIPattern = {
  type: 'EMPLOYEE_ID',
  regex: /EMP-\d{6}/g,
  priority: 10,
  placeholder: '[EMPLOYEE_ID]',
  severity: 'high',
  description: 'Internal employee ID',
  validator: (match) => match.startsWith('EMP-')
};

const detector = new OpenRedaction({
  customPatterns: [employeePattern]
});
```

---

### RedactionMode

Controls how PII is replaced in text.

```typescript
type RedactionMode =
  | 'placeholder'        // [EMAIL_1], [PHONE_1]
  | 'mask-middle'        // j***@example.com
  | 'mask-all'           // ***************
  | 'format-preserving'  // XXX-XX-XXXX
  | 'token-replace';     // fake.email@example.com
```

**Example:**
```typescript
const text = 'Email: john@example.com';

// Different modes
const d1 = new OpenRedaction({ redactionMode: 'placeholder' });
console.log(d1.detect(text).redacted); // 'Email: [EMAIL_1]'

const d2 = new OpenRedaction({ redactionMode: 'mask-middle' });
console.log(d2.detect(text).redacted); // 'Email: j***@example.com'

const d3 = new OpenRedaction({ redactionMode: 'mask-all' });
console.log(d3.detect(text).redacted); // 'Email: *****************'
```

---

## Patterns

### Pattern Categories

```typescript
import { getPatternsByCategory } from 'openredaction';

// Available categories
const categories = [
  'personal',    // Names, DOB, etc.
  'contact',     // Email, phone, address
  'financial',   // Credit cards, bank accounts
  'government',  // SSN, passport, driver's license
  'network',     // IP addresses, MAC addresses
  'health',      // Medical record numbers
  // ... and 20+ more
];

// Get patterns for specific category
const contactPatterns = getPatternsByCategory('contact');
```

### Built-in Pattern Collections

```typescript
import {
  allPatterns,         // All 571+ patterns
  personalPatterns,    // Personal information
  financialPatterns,   // Financial data
  governmentPatterns,  // Government IDs
  contactPatterns,     // Contact information
  networkPatterns      // Network identifiers
} from 'openredaction';
```

---

## Utilities

### Compliance Presets

```typescript
import { gdprPreset, hipaaPreset, ccpaPreset } from 'openredaction';

// Or use preset option
const detector = new OpenRedaction({ preset: 'gdpr' });
```

### Validators

```typescript
import {
  validateEmail,
  validateSSN,
  validateLuhn,      // Credit card validation
  validateIBAN,
  validateNINO,      // UK National Insurance
  validateNHS        // UK NHS number
} from 'openredaction';

// Use in custom patterns
const customPattern: PIIPattern = {
  type: 'CUSTOM_EMAIL',
  regex: /[\w.-]+@[\w.-]+\.\w+/g,
  priority: 10,
  placeholder: '[EMAIL]',
  validator: (match) => validateEmail(match)
};
```

---

## Advanced Features

### Streaming API

For processing large documents:

```typescript
import { createStreamingDetector } from 'openredaction';

const stream = createStreamingDetector(detector, {
  chunkSize: 1024 * 1024  // 1MB chunks
});

stream.on('detection', (detection) => {
  console.log('Found PII:', detection);
});

stream.on('end', (results) => {
  console.log('Total detections:', results.length);
});

largeTextStream.pipe(stream);
```

### Batch Processing

```typescript
import { createBatchProcessor } from 'openredaction';

const batch = createBatchProcessor(detector, {
  batchSize: 100,
  parallel: 4
});

const results = await batch.process([
  'text1...',
  'text2...',
  // ... thousands of texts
]);
```

### Worker Pool (Parallel)

```typescript
import { createWorkerPool } from 'openredaction';

const pool = createWorkerPool({
  workers: 4,
  detectorOptions: { preset: 'gdpr' }
});

const result = await pool.detect('Sensitive text...');

pool.terminate();
```

---

## Error Handling

```typescript
import {
  OpenRedactionError,
  createInvalidPatternError,
  createValidationError
} from 'openredaction';

try {
  const result = detector.detect(text);
} catch (error) {
  if (error instanceof OpenRedactionError) {
    console.error('OpenRedaction error:', error.message);
    console.error('Code:', error.code);
    console.error('Suggestions:', error.suggestions);
  }
}
```

---

## Performance Tips

1. **Use category filtering** for 97.8% faster detection:
   ```typescript
   const detector = new OpenRedaction({
     categories: ['contact']  // Only emails and phones
   });
   ```

2. **Enable caching** for repeated text:
   ```typescript
   const detector = new OpenRedaction({
     enableCache: true,
     cacheSize: 1000
   });
   ```

3. **Adjust input limits** for security:
   ```typescript
   const detector = new OpenRedaction({
     maxInputSize: 5 * 1024 * 1024,  // 5MB
     regexTimeout: 50  // 50ms per pattern
   });
   ```

4. **Use streaming** for large documents
5. **Use worker pools** for parallel processing

---

## See Also

- [README.md](../README.md) - Getting started guide
- [Examples](./EXAMPLES.md) - Comprehensive examples
- [GitHub Repository](https://github.com/sam247/openredaction)
