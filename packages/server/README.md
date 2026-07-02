# @openredaction/server

Zero-dependency Node.js HTTP servers for OpenRedaction: a REST API for PII
detection/redaction and a Prometheus scrape endpoint. Uses Node's built-in
`http` module — no Express, no framework.

## Installation

```bash
npm install @openredaction/server @openredaction/core
```

Requires Node >= 20.

## REST API

```typescript
import { createAPIServer } from "@openredaction/server";

const server = createAPIServer({ port: 3000, apiKey: "secret" });
await server.start();
```

### Endpoints

| Method | Path               | Description                               |
| ------ | ------------------ | ----------------------------------------- |
| POST   | `/api/detect`      | Detect PII in text                        |
| POST   | `/api/redact`      | Detect and redact PII                     |
| POST   | `/api/restore`     | Restore redacted text                     |
| GET    | `/api/patterns`    | List available PII patterns               |
| GET    | `/api/audit/logs`  | Query audit logs (requires `auditLogger`) |
| GET    | `/api/audit/stats` | Audit statistics (requires `auditLogger`) |
| GET    | `/api/metrics`     | Usage metrics                             |
| GET    | `/api/health`      | Health check                              |
| GET    | `/api/docs`        | Interactive HTML documentation            |

### Configuration

| Option            | Default   | Description                                             |
| ----------------- | --------- | ------------------------------------------------------- |
| `port`            | `3000`    | Listen port                                             |
| `host`            | `0.0.0.0` | Bind host                                               |
| `apiKey`          | —         | API key auth via `X-API-Key` or `Authorization: Bearer` |
| `enableCors`      | `true`    | CORS support                                            |
| `enableRateLimit` | `true`    | Per-client rate limiting                                |
| `rateLimit`       | `60`      | Requests per minute                                     |
| `bodyLimit`       | `10mb`    | Max request body size                                   |
| `tenantManager`   | —         | Multi-tenant mode                                       |
| `webhookManager`  | —         | Webhook event delivery                                  |
| `auditLogger`     | —         | Persistent audit logging                                |

## Prometheus Server

```ts
import { createPrometheusServer } from "@openredaction/server";
import { MetricsCollector } from "@openredaction/core";

const collector = new MetricsCollector();
const prom = createPrometheusServer(collector, { port: 9090 });
await prom.start();
```

Scrape from Prometheus:

```yaml
scrape_configs:
  - job_name: "openredaction"
    static_configs:
      - targets: ["localhost:9090"]
```
