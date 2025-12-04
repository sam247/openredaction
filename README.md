# OpenRedaction

[![Version](https://img.shields.io/badge/version-1.0-brightgreen.svg)](https://github.com/sam247/openredaction)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-276%20passing-brightgreen.svg)](https://github.com/sam247/openredaction)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

OpenRedaction is an open-source JavaScript/TypeScript library for detecting and redacting PII with a regex-first approach. It runs locally by default and can be combined with an optional hosted API for AI-assisted detection.

## What is OpenRedaction?

OpenRedaction is a production-ready library that helps you keep sensitive data out of logs, prompts, and analytics pipelines. It combines 570+ curated regex patterns with context-aware validation, multiple redaction modes, and developer-friendly defaults.

**Key principles:**
- **Regex-first**: Pattern-based detection runs locally, fast, and private
- **Fully open source**: MIT licensed, no vendor lock-in
- **Privacy-first**: All detection happens locally by default
- **Production-ready**: Battle-tested with 276+ passing tests

## Installation

```bash
npm install openredaction
```

## Basic Usage (Regex-Only)

The library works entirely with regex patterns by default. All detection happens locally in your application.

```typescript
import { OpenRedaction } from 'openredaction';

const redactor = new OpenRedaction({
  redactionMode: 'placeholder'
});

const result = await redactor.detect('My name is John Smith and my email is john@example.com');

console.log(result.redacted);
// "My name is [NAME_XXXX] and my email is [EMAIL_XXXX]"

console.log(result.detections);
// [{ type: 'EMAIL', value: 'john@example.com', placeholder: '[EMAIL_XXXX]', ... }]
```

### Simple Redaction Example

```typescript
import { OpenRedaction } from 'openredaction';

const redactor = new OpenRedaction({
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  redactionMode: 'mask-middle'
});

const input = "Contact Sarah Jones at sarah@example.com or call +1 202-555-0110";
const { redacted } = await redactor.detect(input);

console.log(redacted);
// "Contact S***h J***s at s***@example.com or call +1 ***-***-0110"
```

### Pre-processing for LLM Pipelines

```typescript
import { OpenRedaction } from 'openredaction';

const redactor = new OpenRedaction({
  preset: 'gdpr',
  redactionMode: 'token-replace',
  deterministic: true
});

async function sanitizeForLLM(text: string) {
  const { redacted, redactionMap } = await redactor.detect(text);
  
  // Safe to send to LLM
  const response = await sendToLLM(redacted);
  
  // Optionally restore for trusted destinations
  const restored = redactor.restore(response, redactionMap);
  return { redacted, restored, redactionMap };
}
```

## PII Types & Patterns Overview

OpenRedaction detects 570+ PII patterns across multiple categories:

### Personal Information
- Email addresses
- Phone numbers (US, UK, International)
- Names (with context-aware validation)
- Social Security Numbers (SSN)
- Passports, Driver's Licenses

### Financial (13+ patterns)
- Credit Cards (with Luhn validation)
- IBANs, Bank Accounts
- Swift Codes, Routing Numbers
- Cryptocurrency addresses

### Government IDs (50+ countries)
- SSN, NINO, NHS Numbers
- Tax IDs, VAT Numbers
- Company Registration Numbers
- ITIN, SIN, and more

### Healthcare
- Medical Record Numbers
- NHS Numbers, CHI, EHIC
- Health Insurance IDs
- Prescription Numbers, DEA Numbers

### Digital Identity
- API Keys, OAuth Tokens
- JWT, Bearer Tokens
- Social Media IDs

### Industries (25+)
- Retail, Legal, Real Estate
- Logistics, Insurance, Healthcare
- Emergency Response, Hospitality
- Professional Certifications, and more

## Advanced Configuration

OpenRedaction is highly configurable. Pass options to the constructor to tailor detection and redaction:

```typescript
const redactor = new OpenRedaction({
  // Toggle built-in categories
  includeNames: true,
  includeAddresses: false,
  includeEmails: true,
  
  // Filter by category or specific patterns
  categories: ['financial'],
  patterns: ['EMAIL', 'SSN'],
  
  // Add custom patterns
  customPatterns: [
    {
      type: 'EMPLOYEE_ID',
      regex: /EMP-\d{4}/g,
      priority: 10,
      placeholder: '[EMPLOYEE_ID_{n}]',
      severity: 'medium',
    },
  ],
  
  // Whitelist approved terms
  whitelist: ['ACME Corp'],
  
  // Redaction modes
  redactionMode: 'mask-all', // placeholder | mask-middle | mask-all | format-preserving | token-replace
  
  // Compliance presets
  preset: 'hipaa', // gdpr | hipaa | ccpa | finance | education | transportation
  
  // Advanced options
  deterministic: true,           // Stable placeholders for same value
  enableContextAnalysis: true,   // Context-aware filtering
  confidenceThreshold: 0.5,
  enableCache: true,
});
```

### Common Presets

- `gdpr` — General data protection defaults (EU)
- `hipaa` — Health data emphasis (US)
- `ccpa` — Consumer privacy defaults (California)
- `finance`, `education`, `transportation` — Sector-focused bundles

## Ecosystem

OpenRedaction is part of a broader ecosystem:

- **openredaction** (this package) — Core library for local, regex-based PII detection and redaction
- **[openredaction-api](https://github.com/sam247/openredaction-api)** — Optional hosted API that wraps this library and provides AI-assisted detection with API keys and rate limiting
- **[openredaction-site](https://openredaction.com)** — Website and playground where you can try the library and hosted API in your browser

### Using the Hosted API (Optional)

If you want AI-assisted detection or don't want to run your own server, you can call the OpenRedaction hosted API with an API key. **Note:** Regex-based self-hosted usage is completely free and doesn't require any API key.

```typescript
// Call the hosted API directly with fetch
const response = await fetch('https://api.openredaction.com/ai-detect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.OPENREDACTION_API_KEY!,
  },
  body: JSON.stringify({ 
    text: 'John Smith, john@example.com' 
  }),
});

const data = await response.json();
console.log(data);
// { entities: [...], aiUsed: true }
```

**Important:**
- The hosted API provides AI-assisted detection and requires an API key
- The core library (this package) runs entirely locally and is free
- AI-assisted detection is provided via the hosted API, not via this library package
- For maximum privacy, use the library locally without any API calls

## Limitations & Disclaimers

- **Best-effort detection**: Regex-based detection is best-effort and may miss edge cases or context-dependent PII
- **Pattern coverage**: While we maintain 570+ patterns, the set is not exhaustive and may not cover all PII types
- **AI-assisted detection**: AI-assisted detection is provided via the hosted API service, not via this library package
- **Manual review recommended**: For highly sensitive use cases, manually review redacted output
- **No guarantees**: This library is provided as-is without warranties. Use at your own risk

## Contributing

We welcome contributions! OpenRedaction is fully open source and community-driven.

### Contribution Areas

- **Pattern improvements**: We maintain a regex hardening plan and welcome contributions to improve or extend patterns
- **Bug fixes**: Report issues and submit fixes
- **Documentation**: Help improve docs and examples
- **Tests**: Add test cases for edge cases

### Contribution Flow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (if applicable)
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for our workflow, coding standards, and testing steps.

### Hardening & Pattern Development

- **[HARDENING_PLAN.md](HARDENING_PLAN.md)** — Our plan for improving regex patterns and detection accuracy
- **[REGEX_AUDIT.md](REGEX_AUDIT.md)** — Audit of existing patterns and potential improvements

## Community & Support

- **Report bugs or request features**: Open a [GitHub issue](https://github.com/sam247/openredaction/issues) with details and reproduction steps
- **Questions or discussions**: Use [GitHub Discussions](https://github.com/sam247/openredaction/discussions) or issues to talk through ideas
- **Attribution**: Mention "OpenRedaction" and link to this repository in research or production use

## License

OpenRedaction is licensed under the [MIT License](LICENSE).
