# Getting Started with OpenRedaction

Complete guide to installing, configuring, and using OpenRedaction.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
- [Detection Modes](#detection-modes)
- [Compliance Presets](#compliance-presets)
- [Performance Tuning](#performance-tuning)
- [Next Steps](#next-steps)

---

## Installation

### npm

```bash
npm install openredaction
```

### yarn

```bash
yarn add openredaction
```

### pnpm

```bash
pnpm add openredaction
```

### Requirements

- Node.js 14+ or modern browser
- TypeScript 4.5+ (optional, for type safety)

### Bundle Size

- Core library: ~100KB minified
- Zero runtime dependencies
- Tree-shakeable ESM build

---

## Basic Usage

### 1. Import and Initialize

```typescript
import { OpenRedaction } from 'openredaction';

const detector = new OpenRedaction();
```

### 2. Detect PII

```typescript
const text = 'Contact John at john@example.com or call 555-1234';
const result = detector.detect(text);

console.log(result.piiFound);   // true
console.log(result.piiCount);   // 2
console.log(result.redacted);   // 'Contact John at [EMAIL_1] or call [PHONE_1]'
```

### 3. Access Detections

```typescript
result.detections.forEach(detection => {
  console.log(`Type: ${detection.type}`);
  console.log(`Value: ${detection.value}`);
  console.log(`Severity: ${detection.severity}`);
  console.log(`Position: ${detection.position}`);
  console.log(`Confidence: ${detection.confidence}`);
});
```

### 4. Restore Original Text

```typescript
// Use the redaction map to reverse redaction
let original = result.redacted;
for (const [placeholder, value] of Object.entries(result.redactionMap)) {
  original = original.replace(placeholder, value);
}
console.log(original === result.original); // true
```

---

## Configuration

### Default Configuration

```typescript
const detector = new OpenRedaction();
// Uses all defaults:
// - All pattern categories enabled
// - Placeholder redaction mode
// - Context analysis enabled
// - Deterministic placeholders
// - 0.5 confidence threshold
```

### Custom Configuration

```typescript
const detector = new OpenRedaction({
  // Pattern selection
  includeNames: true,          // Detect names (default: true)
  includeEmails: true,         // Detect emails (default: true)
  includePhones: true,         // Detect phones (default: true)
  includeAddresses: true,      // Detect addresses (default: true)

  // Redaction
  redactionMode: 'placeholder', // How to redact (default: 'placeholder')
  deterministic: true,          // Consistent placeholders (default: true)

  // Performance
  enableCache: false,           // Cache results (default: false)
  cacheSize: 100,              // Cache size (default: 100)

  // Accuracy
  enableContextAnalysis: true,  // Boost confidence (default: true)
  confidenceThreshold: 0.5,     // Minimum confidence (default: 0.5)

  // Advanced
  enableLearning: true,         // Learn from feedback (default: true)
  debug: false                  // Debug logging (default: false)
});
```

---

## Detection Modes

### Category Filtering (Recommended for Performance)

Only detect specific types of PII for 97.8% faster performance:

```typescript
// Only detect emails and phones
const detector = new OpenRedaction({
  categories: ['contact']
});

// Only detect financial data
const detector = new OpenRedaction({
  categories: ['financial']
});

// Multiple categories
const detector = new OpenRedaction({
  categories: ['personal', 'contact', 'financial']
});
```

**Available Categories:**
- `personal` - Names, DOB, SSN
- `contact` - Email, phone, address
- `financial` - Credit cards, bank accounts
- `government` - Passports, driver's licenses
- `network` - IP addresses, MAC addresses
- `health` - Medical records, patient IDs
- ... and 20+ more

### Pattern Whitelist

Only detect specific pattern types:

```typescript
const detector = new OpenRedaction({
  patterns: ['EMAIL_ADDRESS', 'PHONE_US', 'SSN']
});
```

### Custom Patterns

Add your own PII patterns:

```typescript
const detector = new OpenRedaction({
  customPatterns: [{
    type: 'EMPLOYEE_ID',
    regex: /EMP-\d{6}/g,
    priority: 10,
    placeholder: '[EMPLOYEE_ID]',
    severity: 'high',
    description: 'Internal employee ID'
  }]
});
```

### Whitelist Values

Exclude known safe values:

```typescript
const detector = new OpenRedaction({
  whitelist: [
    'noreply@company.com',
    'support@company.com',
    '555-HELP'
  ]
});
```

---

## Redaction Modes

### Placeholder (Default)

Replaces PII with labeled placeholders:

```typescript
const detector = new OpenRedaction({ redactionMode: 'placeholder' });
detector.detect('Email: john@example.com').redacted;
// 'Email: [EMAIL_1]'
```

### Mask Middle

Partially masks, keeping context:

```typescript
const detector = new OpenRedaction({ redactionMode: 'mask-middle' });
detector.detect('Email: john@example.com').redacted;
// 'Email: j***@example.com'
```

### Mask All

Completely masks with asterisks:

```typescript
const detector = new OpenRedaction({ redactionMode: 'mask-all' });
detector.detect('Email: john@example.com').redacted;
// 'Email: *****************'
```

### Format Preserving

Maintains structure:

```typescript
const detector = new OpenRedaction({ redactionMode: 'format-preserving' });
detector.detect('SSN: 123-45-6789').redacted;
// 'SSN: XXX-XX-XXXX'
```

---

## Compliance Presets

### GDPR (European Union)

```typescript
const detector = new OpenRedaction({ preset: 'gdpr' });
// Detects: Names, emails, phones, addresses, IDs, financial data
// Emphasis: EU data protection standards
```

### HIPAA (US Healthcare)

```typescript
const detector = new OpenRedaction({ preset: 'hipaa' });
// Detects: Medical records, patient IDs, SSN, DOB, addresses
// Emphasis: Protected Health Information (PHI)
```

### CCPA (California Consumer Privacy Act)

```typescript
const detector = new OpenRedaction({ preset: 'ccpa' });
// Detects: Personal info, financial data, biometric data
// Emphasis: California privacy requirements
```

### Combining Presets with Custom Config

```typescript
const detector = new OpenRedaction({
  preset: 'gdpr',
  // Override specific options
  redactionMode: 'hash',
  enableCache: true,
  customPatterns: [/* your patterns */]
});
```

---

## Performance Tuning

### 1. Category Filtering (Biggest Impact)

```typescript
// 97.8% faster for specific categories
const detector = new OpenRedaction({
  categories: ['contact']  // Only emails and phones
});
```

**Performance Comparison:**
- All categories: ~10ms per 2KB text
- Single category: ~0.2ms per 2KB text (50x faster)

### 2. Enable Caching

```typescript
const detector = new OpenRedaction({
  enableCache: true,
  cacheSize: 1000  // Cache up to 1000 results
});

// First call: 10ms
detector.detect('same text...');

// Subsequent calls with same text: <0.1ms (from cache)
detector.detect('same text...');
```

### 3. Adjust Input Limits

```typescript
const detector = new OpenRedaction({
  maxInputSize: 5 * 1024 * 1024,  // 5MB instead of 10MB
  regexTimeout: 50                 // 50ms instead of 100ms
});
```

### 4. Disable Advanced Features

```typescript
const detector = new OpenRedaction({
  enableContextAnalysis: false,     // Faster but less accurate
  enableFalsePositiveFilter: false,
  enableMultiPass: false
});
```

### 5. Use Streaming for Large Documents

```typescript
import { createStreamingDetector } from 'openredaction';

const stream = createStreamingDetector(detector, {
  chunkSize: 1024 * 1024  // Process in 1MB chunks
});

largeTextStream.pipe(stream);
```

---

## Common Patterns

### Validate Before Processing

```typescript
const result = detector.detect(userInput);

if (result.piiFound) {
  // Block submission
  console.error(`Found ${result.piiCount} PII instances. Please remove sensitive data.`);
  return;
}

// Safe to proceed
processData(userInput);
```

### Severity-Based Handling

```typescript
const scan = detector.scan(text);

if (scan.high.length > 0) {
  // Critical PII found (SSN, credit cards, etc.)
  console.error('Critical PII detected! Cannot proceed.');
  return;
}

if (scan.medium.length > 0) {
  // Medium risk PII (emails, phones)
  console.warn('PII detected. Consider redacting.');
}

// Safe for low-severity or no PII
processText(text);
```

### Log Detection Events

```typescript
const result = detector.detect(text);

result.detections.forEach(detection => {
  logger.log({
    timestamp: new Date().toISOString(),
    type: detection.type,
    severity: detection.severity,
    confidence: detection.confidence,
    // Don't log the actual value for security
  });
});
```

---

## TypeScript Usage

### Type Imports

```typescript
import {
  OpenRedaction,
  type OpenRedactionOptions,
  type DetectionResult,
  type PIIDetection,
  type PIIPattern,
  type RedactionMode
} from 'openredaction';
```

### Typed Configuration

```typescript
const options: OpenRedactionOptions = {
  preset: 'gdpr',
  redactionMode: 'placeholder',
  categories: ['personal', 'contact'],
  enableCache: true
};

const detector = new OpenRedaction(options);
```

### Working with Results

```typescript
const result: DetectionResult = detector.detect(text);

result.detections.forEach((detection: PIIDetection) => {
  const { type, value, severity, confidence } = detection;
  // Full type safety
});
```

---

## Error Handling

```typescript
import { OpenRedactionError } from 'openredaction';

try {
  const result = detector.detect(text);
} catch (error) {
  if (error instanceof OpenRedactionError) {
    console.error('OpenRedaction error:', error.message);
    console.error('Error code:', error.code);
    console.error('Suggestions:', error.suggestions);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## Next Steps

- **[API Reference](./API.md)** - Complete API documentation
- **[Examples](./EXAMPLES.md)** - More comprehensive examples
- **[Security Guide](./SECURITY.md)** - Security best practices
- **[Advanced Usage](../README.md#advanced-usage)** - Streaming, batch, workers

---

## Need Help?

- 📖 [Full Documentation](./API.md)
- 💬 [GitHub Discussions](https://github.com/sam247/openredaction/discussions)
- 🐛 [Report Issues](https://github.com/sam247/openredaction/issues)
- 📧 Support: [GitHub Issues](https://github.com/sam247/openredaction/issues)
