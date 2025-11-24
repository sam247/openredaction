# OpenRedaction

Production-ready PII detection and redaction library with 342+ built-in patterns, compliance presets, and zero dependencies.

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
- 🎯 **342+ PII Patterns** - Comprehensive coverage across multiple categories:
  - Personal Data (Email, Phone, SSN, Passports, Driver's Licenses)
  - Financial (Credit Cards, IBANs, Bitcoin, Ethereum)
  - Government IDs (National IDs for 20+ countries including Middle East)
  - Healthcare (Medical Record Numbers, Prescriptions)
  - Emergency Services (911 Call References, Police Reports, Fire Incidents)
  - Digital Identity (Discord, Steam, Social Media, Gaming Platforms)
  - Industry-Specific (Retail, Legal, Real Estate, Logistics, etc.)
- ✅ **Built-in Validators** - Luhn, IBAN, NHS, National ID checksums
- 🔒 **Compliance Presets** - GDPR, HIPAA, CCPA, PCI-DSS
- 🎭 **Deterministic Placeholders** - Consistent redaction for same values
- 🌍 **International Support** - Patterns for Europe, Middle East, Asia-Pacific, Americas
- 🚨 **Emergency Services** - Critical public safety data protection
- 🎮 **Digital Identity** - Social media and gaming platform identifiers
- 🌳 **Zero Dependencies** - No external packages required
- 📝 **TypeScript Native** - Full type safety and IntelliSense
- 🧪 **99%+ Test Coverage** - 400+ passing tests

## Pattern Categories

### Personal Information
Email, Phone Numbers (US, UK, International), Names, Social Security Numbers

### Government IDs
- **North America**: SSN, Driver's Licenses, Passports
- **Europe**: UK NI Numbers, Irish PPS, German Tax IDs, French NIR
- **Middle East**: UAE Emirates ID, Saudi National ID, Israeli Teudat Zehut, Turkish TC Kimlik
- **Asia-Pacific**: Australian Medicare, Canadian SIN, Indian Aadhaar

### Financial
Credit Cards, IBANs, Bank Accounts, Cryptocurrencies (Bitcoin, Ethereum, Litecoin)

### Healthcare
Medical Record Numbers, NHS Numbers, Health Insurance, Prescription Numbers

### Emergency Services
911 Call References, Police Reports, Fire Incidents, Ambulance IDs, Paramedic Certifications

### Digital Identity
Discord, Steam, Twitter/X, Facebook, Instagram, TikTok, YouTube, Gaming Platforms

### Industries
Retail, Legal, Real Estate, Logistics, Insurance, Healthcare, Emergency Response

## License

MIT
