# OpenRedaction

Production-ready PII detection and redaction library with 558+ built-in patterns, multiple redaction modes, compliance presets, and zero dependencies.

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
- 🎯 **558+ PII Patterns** - Comprehensive coverage across multiple categories:
  - Personal Data (Email, Phone, SSN, Passports, Driver's Licenses)
  - Financial (Credit Cards, IBANs, Cryptocurrencies)
  - Government IDs (National IDs for 40+ countries globally)
  - Healthcare (Medical Record Numbers, Prescriptions, Biometric Data)
  - Emergency Services (911 Call References, Police Reports, Fire Incidents)
  - Digital Identity (Discord, Steam, Social Media, Gaming Platforms)
  - Vehicles & Transportation (VIN, License Plates, Tracking Numbers)
  - Aviation (Flight Numbers, IATA Codes, Aircraft Registration)
  - Maritime (IMO Numbers, MMSI, Ship Registration)
  - Industry-Specific (20+ industries including Retail, Legal, Real Estate, Logistics, Hospitality, Environmental & Regulatory)
- 🎨 **Multiple Redaction Modes** - Choose how PII is replaced:
  - Placeholder: `[EMAIL_1234]` (default, fully reversible)
  - Mask Middle: `j***@example.com`, `555-**-4567` (partial visibility)
  - Mask All: `***************` (complete masking)
  - Format Preserving: `XXX-XX-XXXX` (maintains structure)
  - Token Replace: `user47@example.com` (realistic fake data)
- ✅ **Built-in Validators** - Luhn, IBAN, NHS, National ID checksums
- 🔒 **Compliance Presets** - GDPR, HIPAA, CCPA, PCI-DSS
- 🎭 **Deterministic Placeholders** - Consistent redaction for same values
- 🌍 **Global Coverage** - 40+ countries across Europe, Middle East, Asia-Pacific, Americas, Africa, Oceania, Central Asia
- 🌳 **Zero Dependencies** - No external packages required
- 📝 **TypeScript Native** - Full type safety and IntelliSense
- 🧪 **99%+ Test Coverage** - 415+ passing tests

## Pattern Categories

### Personal Information
Email, Phone Numbers (US, UK, International), Names, Social Security Numbers, Passports, Driver's Licenses

### Government IDs (40+ Countries)
- **North America**: US SSN, Canadian SIN, Mexican CURP/RFC
- **Europe**: UK, Germany, France, Spain, Italy, Netherlands, Poland, Czech Republic, Romania, Hungary, Bulgaria, Serbia
- **Eastern Europe**: Russia, Ukraine
- **Middle East**: UAE, Saudi Arabia, Israel, Turkey, Qatar, Kuwait, Bahrain, Oman, Jordan, Lebanon
- **Asia-Pacific**: India, China, Japan, South Korea, Singapore, Australia, Indonesia, Thailand, Malaysia, Philippines, Vietnam, Myanmar
- **Oceania & Pacific**: New Zealand, Fiji, Papua New Guinea, Samoa, Tonga
- **Central Asia**: Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan
- **Latin America**: Argentina, Chile, Colombia, Peru, Venezuela, Ecuador, Uruguay, Brazil, Mexico
- **Africa**: South Africa, Nigeria, Kenya, Egypt, Ghana, Morocco

### Financial
Credit Cards, IBANs, Bank Accounts, Swift Codes, Routing Numbers, Cryptocurrencies (Bitcoin, Ethereum, Litecoin, Monero, Ripple, Cardano, Solana, Polkadot, and 9+ more)

### Healthcare
Medical Record Numbers, NHS Numbers, Health Insurance, Prescription Numbers, DEA Numbers, Biometric Data, Genetic Markers

### Vehicles & Transportation
VIN Numbers, License Plates (All 50 US States + International), Tracking Numbers (16 carriers: FedEx, UPS, USPS, DHL, Amazon, TNT, China/Japan/Royal Mail, Canada/Australia Post, Purolator, OnTrac, GLS, Aramex)

### Aviation
Flight Numbers, IATA Airport Codes, Aircraft Registration, Tail Numbers, FAA Certificates, Booking References

### Maritime
IMO Numbers, MMSI, Ship Registration, Maritime Callsigns, Seafarer IDs, Lloyd's Register Numbers

### Digital Identity
Discord, Steam, Twitter/X, Facebook, Instagram, TikTok, YouTube, Riot Games, Twitch, Esports IDs

### Industries (20+)
Retail, Legal, Real Estate, Logistics, Insurance, Healthcare, Emergency Response, Hospitality, Professional Certifications, Gig Economy, Gaming, Finance, Technology, Education, HR, Manufacturing, Transportation, Media, Charitable, Procurement, Environmental & Regulatory

## License

MIT
