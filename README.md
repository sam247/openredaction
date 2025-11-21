# PII Shield

[![npm version](https://img.shields.io/npm/v/@pii-shield/core.svg)](https://www.npmjs.com/package/@pii-shield/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-98%25-brightgreen.svg)](https://github.com/sam247/redactit)

Production-ready PII detection and redaction library with 20+ built-in patterns, compliance presets, and zero dependencies.

## Features

- 🚀 **Fast & Accurate** - 10-20ms processing for 2-3KB text, 96%+ detection accuracy
- 🎯 **20+ PII Patterns** - Email, SSN, credit cards, phone numbers, addresses, and more
- ✅ **Validators Built-in** - Luhn algorithm, IBAN checksum, NHS numbers, and more
- 🔒 **Compliance Presets** - GDPR, HIPAA, and CCPA configurations
- 🎭 **Deterministic** - Same input always produces same placeholders
- 🌳 **Zero Dependencies** - No external dependencies, works in Node.js and browsers
- 📝 **TypeScript Native** - Full type definitions included
- 🧪 **Well Tested** - 98%+ test coverage with comprehensive test suite

## Installation

```bash
npm install @pii-shield/core
```

## Quick Start

```typescript
import { PIIShield } from '@pii-shield/core';

const shield = new PIIShield();
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

## CLI Usage

```bash
# Detect and redact PII
pii-shield detect "Email john@example.com"

# Scan and show severity breakdown
pii-shield scan "Contact john@example.com or call 555-123-4567"

# Use compliance preset
pii-shield detect "SSN: 123-45-6789" --preset hipaa

# JSON output
pii-shield detect "Card: 4532015112830366" --json

# Filter patterns
pii-shield detect "Text here" --patterns EMAIL,PHONE_US
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

### Network
- **IPV4** - IPv4 addresses (excluding private IPs)
- **IPV6** - IPv6 addresses (excluding local)
- **MAC_ADDRESS** - MAC addresses
- **URL_WITH_AUTH** - URLs with embedded credentials

## Configuration Options

```typescript
const shield = new PIIShield({
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
const shield = new PIIShield({ preset: 'gdpr' });
```
Detects: Email, names, UK/EU phones, addresses, passports, IBAN, credit cards

### HIPAA (US Healthcare)
```typescript
const shield = new PIIShield({ preset: 'hipaa' });
```
Detects: Email, names, SSN, US phones, addresses, dates of birth, medical IDs

### CCPA (California)
```typescript
const shield = new PIIShield({ preset: 'ccpa' });
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

PII Shield uses a priority-based pattern matching system with built-in validators:

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

PII Shield works in all modern browsers and Node.js 20+:

```typescript
import { PIIShield } from '@pii-shield/core';
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

- [ ] Multi-language support (Spanish, French, German, Portuguese)
- [ ] Streaming API for large texts
- [ ] Document support (PDF, DOCX)
- [ ] Framework integrations (LangChain, Vercel AI SDK)
- [ ] Cloud API with managed service
- [ ] Interactive playground website

## Links

- [GitHub Repository](https://github.com/sam247/redactit)
- [npm Package](https://www.npmjs.com/package/@pii-shield/core)
- [Report Issues](https://github.com/sam247/redactit/issues)

---

Built with ❤️ for developers who care about privacy
