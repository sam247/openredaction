# OpenRedaction

[![Version](https://img.shields.io/badge/version-1.0-brightgreen.svg)](https://github.com/sam247/openredaction)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-444%20passing-brightgreen.svg)](https://github.com/sam247/openredaction)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)

![Custom dimensions 1280x640 px](https://github.com/user-attachments/assets/8af856bf-0eb5-4223-949f-44ee29cfebd9)

**Local-first PII detection and redaction library for JavaScript/TypeScript**

Zero dependencies • 571+ patterns • Works everywhere • Production-ready

---

## What is OpenRedaction?

OpenRedaction is a pure JavaScript/TypeScript library for detecting and redacting personally identifiable information (PII) in text. It runs entirely locally with zero runtime dependencies, making it perfect for privacy-sensitive applications, LLM agents, and offline-first tools.

**Key Highlights:**
- 🚀 **Lightning fast** - 2-10ms for typical text, 100x faster than cloud APIs
- 🎯 **571+ patterns** - Comprehensive coverage across 25+ industries
- 🔒 **100% local** - Your data never leaves your infrastructure
- 📦 **Zero dependencies** - ~100KB bundle, works in Node, browser, edge
- 🛡️ **Security hardened** - ReDoS protection, input limits, safe regex
- ✅ **Battle tested** - 444 tests passing, production-ready

---

## Quick Start

```bash
npm install openredaction
```

```typescript
import { OpenRedaction } from 'openredaction';

const detector = new OpenRedaction();
const result = detector.detect('Email: john@example.com, SSN: 123-45-6789');

console.log(result.piiFound);    // true
console.log(result.piiCount);    // 2
console.log(result.redacted);    // 'Email: [EMAIL_1], SSN: [SSN_1]'

// Access detections
result.detections.forEach(d => {
  console.log(`${d.type}: ${d.value} (${d.severity})`);
});
```

---

## Core Features

### 🎯 Comprehensive PII Detection

Detects 571+ PII patterns across:
- **Personal:** Names, DOB, SSN, passport numbers
- **Financial:** Credit cards, bank accounts, crypto wallets
- **Contact:** Emails, phones (50+ countries), addresses
- **Government:** Driver's licenses, tax IDs, health IDs
- **Network:** IP addresses, MAC addresses, API keys
- **Industry-specific:** Medical records, employee IDs, student IDs

### 🔒 Security First

- **ReDoS Protection:** 100ms timeout per pattern prevents regex attacks
- **Input Limits:** 10MB default limit prevents memory exhaustion
- **Pattern Validation:** Custom patterns are validated for safety
- **Safe Regex:** Built-in timeout and match limits

### 📊 Smart Detection

- **Context Analysis:** Boosts confidence based on surrounding text
- **False Positive Filtering:** Reduces false positives by 40%
- **Severity Classification:** 4-tier risk scoring (critical/high/medium/low)
- **Multi-pass Detection:** Optional multi-pass for 15% better accuracy

### ⚡ Performance Optimized

- **Category Filtering:** 97.8% faster when using specific categories
- **Result Caching:** Cache results for repeated text
- **Streaming API:** Process large documents in chunks
- **Worker Pools:** Parallel processing across CPU cores

### 🎛️ Flexible Configuration

- **Compliance Presets:** GDPR, HIPAA, CCPA presets included
- **Redaction Modes:** Placeholder, masking, hashing, removal
- **Custom Patterns:** Easy to add domain-specific patterns
- **Whitelist Support:** Exclude known safe values

---

## Use Cases

- **LLM/AI Agents:** Scrub PII before sending to language models
- **Chat Applications:** Redact sensitive data in real-time
- **Data Processing:** Clean datasets before analytics
- **Compliance:** GDPR/HIPAA data minimization
- **Privacy Tools:** Build privacy-preserving applications
- **Browser Extensions:** Client-side PII detection
- **Edge Functions:** Run on Cloudflare Workers, Deno Deploy, etc.

---

## Installation & Setup

```bash
npm install openredaction
```

### Basic Usage

```typescript
import { OpenRedaction } from 'openredaction';

const detector = new OpenRedaction();
const result = detector.detect(text);
```

### GDPR Compliance

```typescript
const detector = new OpenRedaction({
  preset: 'gdpr',
  redactionMode: 'hash',
  deterministic: true
});
```

### High Performance

```typescript
const detector = new OpenRedaction({
  categories: ['contact'],  // Only emails and phones (97.8% faster)
  enableCache: true,
  cacheSize: 1000
});
```

### Advanced Features

```typescript
const detector = new OpenRedaction({
  enableContextAnalysis: true,     // Boost confidence based on context
  enableFalsePositiveFilter: true, // Reduce false positives
  enableMultiPass: true,            // Better accuracy
  enableLearning: true,             // Learn from feedback
  debug: true                       // Enable debug logging
});
```

### Composable Presets (NEW!)

Combine multiple presets for cross-industry use cases:

```typescript
// UK Fintech Example
const detector = new OpenRedaction({
  presets: ['gdpr', 'financial', 'personal']
});
// Detects: EU compliance + banking + personal info (~30 patterns)

// US Healthcare Example
const detector = new OpenRedaction({
  presets: ['hipaa', 'healthcare', 'personal']
});
// Detects: HIPAA compliance + medical + personal (~30 patterns)

// Tech Startup Example
const detector = new OpenRedaction({
  presets: ['gdpr', 'tech', 'personal']
});
// Detects: EU compliance + API keys/tokens + personal info (~30 patterns)
```

**Available Presets:**
- `gdpr` - EU data protection (15 patterns)
- `hipaa` - US healthcare compliance (16 patterns)
- `ccpa` - California privacy (16 patterns)
- `personal` - Names, emails, phones, addresses (8 patterns)
- `financial` - Credit cards, IBAN, crypto, banking (9 patterns)
- `tech` - IP addresses, API keys, tokens (8 patterns)
- `healthcare` - Medical IDs, patient numbers (6 patterns)

**Backward compatible:** Single preset still works!

```typescript
const detector = new OpenRedaction({ preset: 'gdpr' });  // Still works!
```

---

## Documentation

- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Getting Started](./docs/GETTING_STARTED.md)** - Installation and basic usage
- **[Examples](./docs/EXAMPLES.md)** - Comprehensive examples
- **[Security](./docs/SECURITY.md)** - Security features and best practices

---

## Supported PII Types

<details>
<summary><b>Personal Information</b> (Click to expand)</summary>

- Full names, first/last names
- Social Security Numbers (SSN)
- Date of birth
- Passport numbers (US, UK, EU, etc.)
- National IDs (40+ countries)
</details>

<details>
<summary><b>Financial Information</b></summary>

- Credit cards (Visa, Mastercard, Amex, etc.)
- Bank account numbers (US, UK, IBAN)
- Routing numbers, SWIFT codes
- Cryptocurrency addresses (BTC, ETH, etc.)
</details>

<details>
<summary><b>Contact Information</b></summary>

- Email addresses
- Phone numbers (50+ countries)
- Street addresses (US, UK, EU, etc.)
- Postal codes, ZIP codes
</details>

<details>
<summary><b>Government IDs</b></summary>

- Driver's licenses (US, UK, EU)
- Tax IDs (EIN, VAT, etc.)
- Medicare/Medicaid numbers
- NHS numbers (UK)
</details>

<details>
<summary><b>And 20+ More Categories...</b></summary>

See [full pattern list](./docs/PATTERNS.md) for all 571+ patterns.
</details>

---

## Why OpenRedaction?

### vs. Cloud APIs (AWS Comprehend, Google DLP, etc.)

✅ **100x faster** - 2-10ms vs. 200-500ms round-trip
✅ **Zero cost** - No per-request fees
✅ **Privacy-first** - Data never leaves your infrastructure
✅ **Offline** - Works without internet
✅ **Predictable** - No rate limits or quotas

### vs. Other JavaScript Libraries

✅ **More comprehensive** - 571+ patterns vs. 20-50
✅ **Production-ready** - Security hardened with ReDoS protection
✅ **Better accuracy** - Context analysis + false positive filtering
✅ **Zero dependencies** - Other libraries depend on NLP packages
✅ **TypeScript native** - Full type safety out of the box

---

## Performance

```
Text size: 2KB (typical email)
Processing time: 2-5ms
Throughput: ~400 texts/second

Text size: 100KB (document)
Processing time: 50-100ms
Throughput: ~10 documents/second

With category filtering (contact only):
Processing time: 0.05-1ms (97.8% faster)
Throughput: ~20,000 texts/second
```

---

## Examples

### Detect and Redact

```typescript
const result = detector.detect('Contact: john@example.com, 555-1234');
console.log(result.redacted); // 'Contact: [EMAIL_1], [PHONE_1]'
```

### Severity-Based Scanning

```typescript
const scan = detector.scan(text);
console.log(`High severity: ${scan.high.length}`);    // SSN, credit cards
console.log(`Medium severity: ${scan.medium.length}`); // Emails, phones
console.log(`Low severity: ${scan.low.length}`);       // Addresses
```

### Custom Patterns

```typescript
const detector = new OpenRedaction({
  customPatterns: [{
    type: 'EMPLOYEE_ID',
    regex: /EMP-\d{6}/g,
    priority: 10,
    placeholder: '[EMPLOYEE_ID]',
    severity: 'high'
  }]
});
```

### Whitelist Safe Values

```typescript
const detector = new OpenRedaction({
  whitelist: ['noreply@company.com', 'support@company.com']
});

const result = detector.detect('Email: support@company.com');
console.log(result.piiFound); // false (whitelisted)
```

### Learning from Feedback

```typescript
const result = detector.detect('Download file.pdf');

if (result.detections[0].value === 'file.pdf') {
  // Report false positive
  detector.recordFalsePositive(result.detections[0], 'Generic filename');
}

// After enough reports, automatically whitelisted
```

See [EXAMPLES.md](./docs/EXAMPLES.md) for more examples.

---

## Testing

```bash
npm test                 # Run all tests (444 tests)
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Links

- [GitHub Repository](https://github.com/sam247/openredaction)
- [npm Package](https://www.npmjs.com/package/openredaction)
- [Issue Tracker](https://github.com/sam247/openredaction/issues)
- [Changelog](./CHANGELOG.md)

---

## Acknowledgments

Built with ❤️ for the privacy-conscious developer community.

Special thanks to all contributors and users who have helped improve this library.
