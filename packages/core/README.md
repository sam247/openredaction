# OpenRedaction

Production-ready PII detection and redaction library with 571+ built-in patterns, multiple redaction modes, compliance presets, enterprise SaaS features, and zero dependencies.

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
```

## React (optional)

React hooks are on a separate entry so the main package stays React-free. If you use React:

```bash
npm install openredaction react
```

```tsx
import { useOpenRedaction, usePIIDetector } from 'openredaction/react';
```

`react` is an optional peer dependency; only install it if you use the React entry.

## Optional AI Assist

OpenRedaction supports an optional AI-assisted detection mode that enhances regex-based detection by calling a hosted AI endpoint. This feature is **OFF by default** and requires explicit configuration.

### Configuration

```typescript
import { OpenRedaction } from 'openredaction';

const detector = new OpenRedaction({
  // ... other options ...
  ai: {
    enabled: true,
    endpoint: 'https://your-api.example.com' // Optional: defaults to OPENREDACTION_AI_ENDPOINT env var
  }
});

// detect() is now async when AI is enabled
const result = await detector.detect('Contact John Doe at john@example.com');
```

### How It Works

1. **Regex Detection First**: The library always runs regex detection first (existing behavior)
2. **AI Enhancement**: If `ai.enabled === true` and an endpoint is configured, the library calls the `/ai-detect` endpoint
3. **Smart Merging**: AI entities are merged with regex detections, with regex taking precedence on conflicts
4. **Graceful Fallback**: If the AI endpoint fails or is unavailable, the library silently falls back to regex-only detection

### Environment Variables

In Node.js environments, you can set the endpoint via environment variable:

```bash
export OPENREDACTION_AI_ENDPOINT=https://your-api.example.com
```

### Important Notes

- **AI is optional**: The library works exactly as before when `ai.enabled` is `false` or omitted
- **Regex is primary**: AI only adds additional entities; regex detections always take precedence
- **No breaking changes**: When AI is disabled, behavior is identical to previous versions
- **Browser support**: In browsers, you must provide an explicit `ai.endpoint` (env vars not available)
- **Network dependency**: AI mode requires network access to the endpoint

### For Sensitive Workloads

For maximum security and privacy, keep AI disabled and rely purely on regex detection:

```typescript
const detector = new OpenRedaction({
  // AI not configured = pure regex detection
  includeNames: true,
  includeEmails: true
});
```

## Documentation

Full documentation available at [GitHub](https://github.com/sam247/openredaction)

## Features

- 🚀 **Fast & Accurate** - 10-20ms for 2-3KB text
- 🎯 **571+ PII Patterns** - Comprehensive coverage across multiple categories
- 🔐 **Enterprise SaaS Ready** - Multi-tenancy, persistent audit logging, webhooks, REST API
- 📊 **Production Monitoring** - Prometheus metrics, Grafana dashboards, health checks
- 🧠 **Semantic Detection** - Hybrid NER + regex with 40+ contextual rules
- 🎨 **Multiple Redaction Modes** - Placeholder, mask-middle, mask-all, format-preserving, token-replace
- ✅ **Built-in Validators** - Luhn, IBAN, NHS, National ID checksums
- 🔒 **Compliance Presets** - GDPR, HIPAA, CCPA plus finance, education, healthcare, and transport presets
- 🎭 **Deterministic Placeholders** - Consistent redaction for same values
- 🌍 **Global Coverage** - 50+ countries
- 📄 **Structured Data Support** - JSON, CSV, XLSX with path/cell tracking
- 🌳 **Zero Dependencies** - No external packages required (core)
- 📝 **TypeScript Native** - Full type safety and IntelliSense
- 🧪 **Battle Tested** - 276+ passing tests

## Pattern Categories

### Personal Information
Email, Phone Numbers (US, UK, International), Names, Social Security Numbers, Passports, Driver's Licenses

### Financial (13 patterns)
Credit Cards, IBANs, Bank Accounts, Swift Codes, Routing Numbers, IFSC, CLABE, BSB, ISIN, CUSIP, SEDOL, LEI, Cryptocurrencies

### Government IDs (50+ countries)
SSN, NINO, NHS, Passports, Tax IDs, UTR, VAT, Company Numbers, ITIN, SIN, and more

### Healthcare
Medical Record Numbers, NHS Numbers, CHI, EHIC, Health Insurance, Prescription Numbers, DEA Numbers, Biometric Data

### Digital Identity
API Keys, OAuth Tokens, JWT, Bearer Tokens, Discord, Steam, Social Media IDs

### Industries (25+)
Retail, Legal, Real Estate, Logistics, Insurance, Healthcare, Emergency Response, Hospitality, Professional Certifications, and more

## Enterprise Features

- **Persistent Audit Logging** - SQLite/PostgreSQL with cryptographic hashing
- **Multi-Tenancy** - Tenant isolation, quotas, usage tracking
- **Prometheus Metrics** - HTTP server with Grafana dashboards
- **Webhook System** - Event-driven alerts with retry logic
- **REST API** - Production-ready HTTP API with authentication

## License

MIT
