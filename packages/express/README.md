# @openredaction/express

Express middleware and route handlers for PII detection and redaction. Inspects
request bodies, optionally auto-redacts fields, and attaches results to
`req.pii`. Express is a peer dependency (`>=4.18 || >=5`).

## Installation

```bash
npm install @openredaction/express @openredaction/core express
```

## Quick Start

```ts
import express from "express";
import { openredactionMiddleware } from "@openredaction/express";

const app = express();
app.use(express.json());

// Auto-redact PII in all request bodies
app.use(openredactionMiddleware({ autoRedact: true }));

app.post("/submit", (req, res) => {
  // req.body fields are redacted in-place
  // req.pii has detection metadata
  res.json({ pii: req.pii, body: req.body });
});
```

## Middleware Options

| Option          | Default | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| `autoRedact`    | `false` | Redact PII in request body in-place          |
| `fields`        | all     | Limit detection to specific body fields      |
| `skipRoutes`    | `[]`    | Skip routes matching regex patterns          |
| `attachResults` | `true`  | Attach detection results to `req.pii`        |
| `failOnPII`     | `false` | Reject request with 400 if PII found         |
| `addHeaders`    | `false` | Add `X-PII-Detected` / `X-PII-Count` headers |
| `onDetection`   | —       | Callback when PII is detected                |

## Route Handlers

```ts
import { detectPII, generateReport } from "@openredaction/express";

app.post("/detect", detectPII());
app.post("/report", generateReport());
```

- `detectPII()` — returns detection results as JSON
- `generateReport()` — supports `json`, `html`, and `markdown` formats via
  `format` query/body param

## License

MIT
