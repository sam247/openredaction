# @openredaction/core

## 2.0.0

### Major Changes

- [#112](https://github.com/sam247/openredaction/pull/112) [`2cee61b`](https://github.com/sam247/openredaction/commit/2cee61b9633ae3194cc7275b26015fb9d814cab9) Thanks [@atomicpages](https://github.com/atomicpages)! - Restructured package: subpath exports, profiles, and a leaner default detection set.

  **Subpath exports.** The root entry now contains the detection core only. Infrastructure subsystems moved to dedicated subpaths:

  | Moved symbols                                                                            | New import                      |
  | ---------------------------------------------------------------------------------------- | ------------------------------- |
  | `InMemoryAuditLogger`, `ConsoleAuditLogger`, `PersistentAuditLogger`, …                  | `@openredaction/core/audit`     |
  | `BatchProcessor`, `createBatchProcessor`                                                 | `@openredaction/core/batch`     |
  | `DocumentProcessor`, `CsvProcessor`, `JsonProcessor`, `XlsxProcessor`, `OCRProcessor`, … | `@openredaction/core/documents` |
  | `HealthChecker`, `createHealthChecker`, `healthCheckMiddleware`                          | `@openredaction/core/health`    |
  | `InMemoryMetricsCollector`                                                               | `@openredaction/core/metrics`   |
  | `RBACManager`, role constants, `createCustomRole`, …                                     | `@openredaction/core/rbac`      |
  | `ReportGenerator`, `createReportGenerator`                                               | `@openredaction/core/reports`   |
  | `StreamingDetector`, `createStreamingDetector`                                           | `@openredaction/core/streaming` |
  | `TenantManager`, tenant errors, `DEFAULT_TIER_QUOTAS`                                    | `@openredaction/core/tenancy`   |
  | `WebhookManager`, `verifyWebhookSignature`                                               | `@openredaction/core/webhooks`  |
  | `WorkerPool`, `createWorkerPool`                                                         | `@openredaction/core/workers`   |

  Interface types referenced by options (`IAuditLogger`, `IMetricsCollector`, `IRBACManager`, `Role`, `Permission`, …) and types returned by `OpenRedaction` methods stay on the root entry.

  **Profiles replace `enable*` subsystem flags.** `enableLearning`, `enablePriorityOptimization`, `enableNER`, `enableContextRules`, `enableAuditLog`, `enableMetrics`, and `enableRBAC` are gone:

  ```ts
  // before
  new OpenRedaction({ enableLearning: false, enableNER: true });
  // after
  new OpenRedaction({ profile: "minimal", features: { ner: true } });
  ```

  Providing a collaborator (`auditLogger`, `metricsCollector`, `rbacManager`, `role`) now enables its subsystem automatically. Detection-tuning flags (`enableCache`, `enableMultiPass`, `enableFalsePositiveFilter`, `enableContextAnalysis`) are unchanged.

  **Leaner default detection set.** The default pattern list now covers core PII categories (personal, financial, crypto, government, contact, network, digital identity) plus credentials (API keys/tokens) — 110 patterns instead of 579. Industry verticals and international ID patterns are opt-in:

  ```ts
  // before: maritime/gaming/emergency/… patterns ran on every detect()
  new OpenRedaction();
  // after: request the verticals you need
  new OpenRedaction({ categories: ["healthcare", "maritime"] });
  // or run everything, as before
  new OpenRedaction({ patterns: allPatterns.map((p) => p.type) });
  ```

  `allPatterns` still exports the complete set; `defaultPatterns` exports the new default.

  **Subsystem methods moved off `OpenRedaction`.** The facade no longer imports document/report/health/worker modules, so root-entry bundles now exclude them:

  ```ts
  // before                                    // after
  detector.detectDocument(buf, opts);          import { detectDocument } from "@openredaction/core/documents";
                                               detectDocument(detector, buf, opts);
  detector.detectDocumentFile(path);           detectDocumentFile(detector, path);
  detector.generateReport(result, opts);       import { createReportGenerator } from "@openredaction/core/reports";
                                               createReportGenerator().generate(result, opts);
  detector.healthCheck(opts);                  import { createHealthChecker } from "@openredaction/core/health";
  detector.quickHealthCheck();                 createHealthChecker(detector).check(opts) / .quickCheck();
  OpenRedaction.detectBatch(texts, opts);      import { detectBatch, detectDocumentsBatch } from "@openredaction/core/workers";
  OpenRedaction.detectDocumentsBatch(bufs);    detectBatch(texts, opts) / detectDocumentsBatch(bufs, opts);
  ```

  `explain()` and `exportConfig()` remain on the class.

  **Fixed:** `WorkerPool` resolved its worker script with `__dirname` (crashed in ESM) against a filename (`worker.js`) that the build never produced (`worker.cjs`) — worker pools now function from both ESM and CJS entries.

## 1.1.5

## 1.1.4

### Patch Changes

- [#104](https://github.com/sam247/openredaction/pull/104) [`4a0fdf4`](https://github.com/sam247/openredaction/commit/4a0fdf48f745e4150f8d91e460c61423f57fc810) Thanks [@sam247](https://github.com/sam247)! - Fix published package manifests: rewrite `workspace:*` dependencies to concrete semver ranges before npm publish so consumers can install with npm, pnpm, and yarn.

## 1.1.3

### Patch Changes

- OIDC trusted-publishing smoke validation (patch-only).
