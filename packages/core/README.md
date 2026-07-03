# OpenRedaction

Production-ready PII detection and redaction library with 571+ built-in
patterns, multiple redaction modes, compliance presets, and optional
enterprise-style modules. The published package lists **no required runtime
dependencies**; optional peers (e.g. React, PDF) apply only when you use those
integrations.

## Installation

```bash
npm install openredaction
```

## Quick Start

`detect()` is **async** — use `await` (inside an `async` function or with
top-level `await` in ESM).

```typescript
import { OpenRedaction } from "openredaction";

const shield = new OpenRedaction();
const result = await shield.detect(
  "Email john@example.com or call 07700900123",
);

console.log(result.redacted);
// "Email [EMAIL_9619] or call [PHONE_UK_MOBILE_9478]"
```

## React (optional)

React hooks are on a separate entry so the main package stays React-free. If you
use React:

```bash
npm install openredaction react
```

```tsx
import { useOpenRedaction, usePIIDetector } from "openredaction/react";
```

`react` is an optional peer dependency; only install it if you use the React
entry.

## Node HTTP API & Prometheus (optional)

`APIServer`, `createAPIServer`, `PrometheusServer`, and `createPrometheusServer`
use Node’s built-in `http` module. They are **not** re-exported from the main
entry (`openredaction`) so the default bundle stays free of `node:http` for
clearer static analysis.

```typescript
import { APIServer, createPrometheusServer } from "openredaction/server";
```

## Documentation

- Site & playground: [openredaction.com](https://openredaction.com)
- Source & issues: [GitHub](https://github.com/sam247/openredaction)

## Features

- 🚀 **Fast & Accurate** - 10-20ms for 2-3KB text
- 🎯 **571+ PII Patterns** - Comprehensive coverage across multiple categories
- 🔐 **Enterprise SaaS Ready** - Multi-tenancy, persistent audit logging,
  webhooks, REST API
- 📊 **Production Monitoring** - In-memory metrics collector; optional
  Prometheus HTTP server via `openredaction/server`
- 🧠 **Semantic Detection** - Hybrid NER + regex with 40+ contextual rules
- 🎨 **Multiple Redaction Modes** - Placeholder, mask-middle, mask-all,
  format-preserving, token-replace
- ✅ **Built-in Validators** - Luhn, IBAN, NHS, National ID checksums
- 🔒 **Compliance Presets** - GDPR, HIPAA, CCPA plus finance, education,
  healthcare, and transport presets
- 🎭 **Deterministic Placeholders** - Consistent redaction for same values
- 🌍 **Global Coverage** - 50+ countries
- 📄 **Structured Data Support** - JSON, CSV, XLSX with path/cell tracking
- 🌳 **No required runtime deps** - Core redaction does not pull mandatory npm
  packages
- 📝 **TypeScript Native** - Full type safety and IntelliSense
- 🧪 **Battle Tested** - Large automated test suite

## Pattern Categories

### Personal Information

Email, Phone Numbers (US, UK, International), Names, Social Security Numbers,
Passports, Driver's Licenses

### Financial (13 patterns)

Credit Cards, IBANs, Bank Accounts, Swift Codes, Routing Numbers, IFSC, CLABE,
BSB, ISIN, CUSIP, SEDOL, LEI, Cryptocurrencies

### Government IDs (50+ countries)

SSN, NINO, NHS, Passports, Tax IDs, UTR, VAT, Company Numbers, ITIN, SIN, and
more

### Healthcare

Medical Record Numbers, NHS Numbers, CHI, EHIC, Health Insurance, Prescription
Numbers, DEA Numbers, Biometric Data

### Digital Identity

API Keys, OAuth Tokens, JWT, Bearer Tokens, Discord, Steam, Social Media IDs

### Industries (25+)

Retail, Legal, Real Estate, Logistics, Insurance, Healthcare, Emergency
Response, Hospitality, Professional Certifications, and more

## Enterprise Features

- **Persistent Audit Logging** - SQLite/PostgreSQL with cryptographic hashing
- **Multi-Tenancy** - Tenant isolation, quotas, usage tracking
- **Prometheus Metrics** - Optional scrape endpoint (`openredaction/server`)
- **Webhook System** - Event-driven alerts with retry logic
- **REST API** - Optional HTTP API (`openredaction/server`)

## License

MIT
