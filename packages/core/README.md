# @pii-shield/core

Production-ready PII detection and redaction library with 20+ built-in patterns, compliance presets, and zero dependencies.

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
```

## Documentation

Full documentation available at [GitHub](https://github.com/sam247/redactit)

## Features

- 🚀 Fast & Accurate (10-20ms for 2-3KB text)
- 🎯 20+ PII Patterns (Email, SSN, credit cards, etc.)
- ✅ Built-in Validators (Luhn, IBAN, NHS, etc.)
- 🔒 Compliance Presets (GDPR, HIPAA, CCPA)
- 🎭 Deterministic Placeholders
- 🌳 Zero Dependencies
- 📝 TypeScript Native
- 🧪 98%+ Test Coverage

## License

MIT
