# OpenRedaction

[![Version](https://img.shields.io/badge/version-1.0-brightgreen.svg)](https://github.com/sam247/openredact)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-276%20passing-brightgreen.svg)](https://github.com/sam247/openredact)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)

![Custom dimensions 1280x640 px](https://github.com/user-attachments/assets/8af856bf-0eb5-4223-949f-44ee29cfebd9)

Production-ready TypeScript toolkit for detecting and redacting PII across text and structured data.

## Why this exists

OpenRedaction makes it easy to keep sensitive data out of logs, prompts, and analytics pipelines. It combines hundreds of curated patterns with context-aware checks, multiple redaction modes, and developer-friendly defaults so you can ship privacy-safe applications quickly.

## Features

- 570+ built-in detectors with contextual validation to minimize false positives
- Multiple redaction modes: placeholders, middle-mask, full-mask, format-preserving, and token replacement
- Global coverage across personal, financial, healthcare, government, and digital identity patterns
- Structured data support for JSON/CSV/XLSX with path-level tracking
- Fast performance (tuned for streaming and high-throughput services)
- Compliance presets (GDPR, HIPAA, CCPA, finance, education, transport) and deterministic placeholders
- Enterprise options: audit logging, metrics hooks, RBAC, health checks, and multi-tenancy scaffolding
- TypeScript-first API with zero external runtime dependencies in the core package

## Quickstart

```bash
npm install openredaction
```

```typescript
import { OpenRedaction } from 'openredaction';

const shield = new OpenRedaction({ redactionMode: 'placeholder' });
const result = shield.detect('Contact Mary at mary@example.com or call +1 202-555-0110.');

console.log(result.redacted);
// "Contact Mary at [EMAIL_XXXX] or call [PHONE_US_XXXX]."
console.log(result.detections);
// [{ type: 'EMAIL', value: 'mary@example.com', placeholder: '[EMAIL_XXXX]', ... }]
```

## Usage examples

### Simple Node.js script

```typescript
import { OpenRedaction } from 'openredaction';

const shield = new OpenRedaction({
  includeNames: true,
  redactionMode: 'mask-middle',
});

const transcript = `Agent Sarah Jones spoke with customer Bob at bob@example.com about card 4242-4242-4242-4242.`;
const { redacted, detections } = shield.detect(transcript);

console.log(redacted);
// Agent S***h J***s spoke with customer B** at b**@example.com about card ****-****-****-****.
console.table(detections.map(({ type, placeholder }) => ({ type, placeholder })));
```

### Pre-processing for an LLM or agent pipeline

```typescript
import { OpenRedaction } from 'openredaction';
import { sendToModel } from './llm-client';

const shield = new OpenRedaction({
  preset: 'gdpr',
  redactionMode: 'token-replace',
  deterministic: true,
});

async function handleUserMessage(message: string) {
  const { redacted, redactionMap } = shield.detect(message);

  // Safe to forward to the model
  const modelResponse = await sendToModel(redacted);

  // Optionally restore for trusted destinations
  const restored = shield.restore(modelResponse, redactionMap);
  return { redacted, restored, redactionMap };
}
```

## Configuration

OpenRedaction is highly configurable; pass options to the constructor to tailor detection and redaction.

```typescript
const shield = new OpenRedaction({
  includeNames: true,            // Toggle built-in categories
  includeAddresses: false,
  includeEmails: true,
  categories: ['financial'],     // Only include certain categories
  patterns: ['EMAIL', 'SSN'],    // Whitelist specific patterns
  customPatterns: [              // Add your own detectors
    {
      type: 'EMPLOYEE_ID',
      regex: /EMP-\d{4}/g,
      priority: 10,
      placeholder: '[EMPLOYEE_ID_{n}]',
      severity: 'medium',
    },
  ],
  whitelist: ['ACME Corp'],      // Ignore approved terms
  redactionMode: 'mask-all',     // placeholder | mask-middle | mask-all | format-preserving | token-replace
  preset: 'hipaa',               // Compliance presets
  deterministic: true,           // Stable placeholders for the same value
  enableContextAnalysis: true,   // Context-aware filtering
  confidenceThreshold: 0.5,
  enableCache: true,
});
```

Common presets:

- `gdpr` — general data protection defaults
- `hipaa` — health data emphasis
- `ccpa` — consumer privacy defaults
- `finance`, `education`, `transportation` — sector-focused bundles

## Contributing

We welcome issues, feature requests, and pull requests from the community. See [CONTRIBUTING.md](CONTRIBUTING.md) for our workflow, coding standards, and testing steps.

## Community & support

- **Report bugs or request features:** Open a GitHub issue with details and reproduction steps.
- **Questions or discussions:** Use GitHub Discussions or issues to talk through ideas.
- **Attribution:** Mention "OpenRedaction" and link to this repository in research or production use.

## License

OpenRedaction is licensed under the [MIT License](LICENSE).

## Badges

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
