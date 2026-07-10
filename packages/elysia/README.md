# @openredaction/elysia

Elysia plugins for PII detection and redaction. Inspects request bodies,
optionally auto-redacts fields, and attaches results to the Elysia context via
`{ pii }` destructuring. Elysia is a peer dependency (`>=1.0.0`).

## Installation

```bash
npm install @openredaction/elysia @openredaction/core elysia
```

## Quick Start

```ts
import { Elysia } from "elysia";
import { openredactionPlugin } from "@openredaction/elysia";

const app = new Elysia()
  // Auto-redact PII in all request bodies
  .use(openredactionPlugin({ autoRedact: true }))
  .post("/submit", ({ pii, redactedBody }) => {
    return { detected: pii?.detected, count: pii?.count };
  });
```

## Plugin Options

| Option          | Default | Description                                    |
| --------------- | ------- | ---------------------------------------------- |
| `autoRedact`    | `false` | Store redacted body in `redactedBody` context  |
| `fields`        | all     | Limit detection to specific body fields        |
| `skipRoutes`    | `[]`    | Skip routes matching regex patterns            |
| `attachResults` | `true`  | Attach detection results to `pii` context      |
| `failOnPII`     | `false` | Reject request with 400 if PII found           |
| `addHeaders`    | `false` | Add `X-PII-Detected` / `X-PII-Count` headers   |
| `onDetection`   | —       | Callback when PII is detected                  |

## Route Handler Plugins

```ts
import { detectPIIPlugin, generateReportPlugin } from "@openredaction/elysia";

const app = new Elysia()
  .use(detectPIIPlugin({ patterns: ["EMAIL"] }))
  .use(generateReportPlugin());
```

- `detectPIIPlugin()` — mounts `POST /detect`, accepts `{ text: string }`,
  returns detection results as JSON
- `generateReportPlugin()` — mounts `POST /report`, accepts
  `{ text: string, format?: "json"|"html"|"markdown", title?: string }`,
  returns a report in the requested format

Both plugins use TypeBox schema validation for automatic request validation.

## License

MIT
