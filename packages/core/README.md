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
