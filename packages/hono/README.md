# @openredaction/hono

Hono middleware and route handlers for PII detection and redaction. Inspects
request bodies, optionally auto-redacts fields, and attaches results to the Hono
context via `c.get("pii")`. Hono is a peer dependency (`>=4`).

## Installation

```bash
npm install @openredaction/hono @openredaction/core hono
```

## Quick Start

```ts
import { Hono } from "hono";
import { openredactionMiddleware } from "@openredaction/hono";

const app = new Hono();

// Auto-redact PII in all request bodies
app.use(openredactionMiddleware({ autoRedact: true }));

app.post("/submit", (c) => {
  const pii = c.get("pii");
  return c.json({ detected: pii.detected, count: pii.count });
});
```

## Middleware Options

| Option          | Default | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| `autoRedact`    | `false` | Redact PII in request body in-place          |
| `fields`        | all     | Limit detection to specific body fields      |
| `skipRoutes`    | `[]`    | Skip routes matching regex patterns          |
| `attachResults` | `true`  | Attach detection results to `c.get("pii")`   |
| `failOnPII`     | `false` | Reject request with 400 if PII found         |
| `addHeaders`    | `false` | Add `X-PII-Detected` / `X-PII-Count` headers |
| `onDetection`   | —       | Callback when PII is detected                |

## Route Handlers

```ts
import { detectPII, generateReport } from "@openredaction/hono";

app.post("/detect", detectPII());
app.post("/report", generateReport());
```

- `detectPII()` — returns detection results as JSON
- `generateReport()` — supports `json`, `html`, and `markdown` formats via
  `format` query/body param

## License

MIT
