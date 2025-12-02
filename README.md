# OpenRedaction

[![Version](https://img.shields.io/badge/version-1.0-brightgreen.svg)](https://github.com/sam247/openredact)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-276%20passing-brightgreen.svg)](https://github.com/sam247/openredact)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

![Custom dimensions 1280x640 px](https://github.com/user-attachments/assets/8af856bf-0eb5-4223-949f-44ee29cfebd9)

Production-ready TypeScript toolkit for detecting and redacting PII across text and structured data.

## Why this exists

OpenRedaction makes it easy to keep sensitive data out of logs, prompts, and analytics pipelines. It combines hundreds of curated patterns with context-aware checks, multiple redaction modes, and developer-friendly defaults so you can ship privacy-safe applications quickly.

## Features

- **Regex-first detection** — 570+ built-in detectors with contextual validation to minimize false positives
- **Optional AI assist** — Enhance detection for messy, unstructured natural language (fully optional, regex remains primary)
- Multiple redaction modes: placeholders, middle-mask, full-mask, format-preserving, and token replacement
- Global coverage across personal, financial, healthcare, government, and digital identity patterns
- Structured data support for JSON/CSV/XLSX with path-level tracking
- Fast performance (tuned for streaming and high-throughput services)
- Compliance presets (GDPR, HIPAA, CCPA, finance, education, transport) and deterministic placeholders
- Industry starter packs and quickstart recipes in docs/examples to cover common pipelines (logs, LLMs, ETL) without adding bundle weight
- Enterprise options: audit logging, metrics hooks, RBAC, health checks, and multi-tenancy scaffolding
- Lightweight NPM package with zero external runtime dependencies in the core; optional dashboards and deployment snippets stay in docs/examples to avoid shipping heavy assets
- **Fully open source** — MIT licensed, privacy-first, no vendor lock-in

## Quickstart

```bash
npm install openredaction
```

```typescript
import { OpenRedaction } from 'openredaction';

const shield = new OpenRedaction({ redactionMode: 'placeholder' });
const result = await shield.detect('Contact Mary at mary@example.com or call +1 202-555-0110.');

console.log(result.redacted);
// "Contact Mary at [EMAIL_XXXX] or call [PHONE_US_XXXX]."
console.log(result.detections);
// [{ type: 'EMAIL', value: 'mary@example.com', placeholder: '[EMAIL_XXXX]', ... }]
```

> **Note:** `detect()` is now async to support optional AI assist. All existing code continues to work; just add `await` if you enable AI assist.

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
  const { redacted, redactionMap } = await shield.detect(message);

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

## Optional AI Assist

OpenRedaction works entirely with regex by default. AI assist is an **optional enhancement** for messy, unstructured natural language where regex patterns may miss context-dependent PII.

### How It Works

- **Regex-first**: OpenRedaction always runs regex detection first. Regex is the primary and authoritative detection method.
- **AI enhancement**: When enabled, AI assist calls the hosted OpenRedaction AI proxy (`POST /ai-detect`) to find additional PII entities in unstructured text.
- **Entity-based**: AI assist returns PII **entities** (type, value, position), not rewritten text. These entities are merged with regex detections.
- **No DeepSeek account required**: The hosted proxy handles all AI interactions. You just configure the endpoint.
- **Regex wins on conflicts**: If AI and regex detect overlapping entities, regex takes precedence.

### Code Example

```typescript
import { OpenRedaction } from "openredaction";

const redactor = new OpenRedaction({
  ai: {
    enabled: true, 
    endpoint: "https://api.openredaction.com" // or your self-hosted endpoint
  }
});

const result = await redactor.redact("Hi, my name is John Smith and my email is john@example.com");

console.log(result.redacted);
// "Hi, my name is [NAME_XXXX] and my email is [EMAIL_XXXX]"

console.log(result.detections);
// Array of detected entities from both regex and AI
```

### AI Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ai.enabled` | `boolean` | `false` | Enable AI-assisted detection |
| `ai.endpoint` | `string` | `OPENREDACTION_AI_ENDPOINT` env var | Base URL for the AI endpoint |

**Environment variable (Node.js):**
```bash
export OPENREDACTION_AI_ENDPOINT=https://api.openredaction.com
```

**AI Fallback Behavior:**
- If the endpoint fails → falls back to regex-only (no errors thrown)
- If JSON response is invalid → falls back to regex-only
- If entity spans overlap → regex detections take precedence

### Privacy and Security

- **AI assist is optional**: The library works perfectly without it. Regex-only mode is fully local and private.
- **When enabled**: Text is sent to the configured endpoint (hosted proxy or self-hosted).
- **No logging or storage**: The hosted proxy does not log or store your text.
- **Regex-only mode**: For maximum privacy, simply don't enable AI assist. All detection happens locally.

### When to Use Regex-Only vs AI Assist

| Input Type | Recommended Mode | Reason |
|------------|------------------|--------|
| Logs / structured fields | Regex-only | Structured data is regex-friendly |
| CSV / spreadsheets | Regex-only | Tabular data has consistent patterns |
| HR reports / complaints | AI assist | Natural language with context |
| Emails, chats, free text | AI assist | Unstructured, conversational text |
| Mixed structured + unstructured | AI assist | AI helps catch edge cases |

### Self-Hosting AI Assist

Advanced users can set `ai.endpoint` to any compatible endpoint, including:
- Self-hosted `openredaction-api` instance
- Custom proxy that implements the `/ai-detect` endpoint contract
- Future DeepSeek BYOK (Bring Your Own Key) endpoints

The endpoint must accept `POST /ai-detect` with `{ text: string }` and return `{ entities: Array<{ type: string, value: string, start: number, end: number }>, aiUsed: boolean }`.

### Migration Notes

**No breaking changes:**
- All existing code works without modification
- AI assist is OFF by default
- Regex-only mode behaves identically to previous versions

**Async detection:**
- `detect()` is now async to support AI calls
- If you enable AI assist, add `await` to your `detect()` calls
- If you stay with regex-only, you can still use `await` (it's safe) or update gradually

**Example migration:**
```typescript
// Before (still works, but now returns Promise)
const result = await shield.detect(text);

// Or if you want to keep sync-like code without AI:
const result = await shield.detect(text); // Works fine, just add await
```

## Contributing

We welcome issues, feature requests, and pull requests from the community. See [CONTRIBUTING.md](CONTRIBUTING.md) for our workflow, coding standards, and testing steps.

## Community & support

- **Report bugs or request features:** Open a GitHub issue with details and reproduction steps.
- **Questions or discussions:** Use GitHub Discussions or issues to talk through ideas.
- **Attribution:** Mention "OpenRedaction" and link to this repository in research or production use.

## License

OpenRedaction is licensed under the [MIT License](LICENSE).
