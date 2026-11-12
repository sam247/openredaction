# @openredaction/core

## 2.0.1

### Patch Changes

- [#168](https://github.com/sam247/openredaction/pull/168) [`6b98c19`](https://github.com/sam247/openredaction/commit/6b98c191d8ceda0030cf71ab798e78dd2f522693) Thanks [@BilliamBaSH](https://github.com/BilliamBaSH)! - Email pattern no longer matches package versions (`lodash@4.17.21`), image file names (`icon@2x.png`), prices (`price=5@3.50`) or domains with a numeric TLD (`user@acme.123`).

- [#167](https://github.com/sam247/openredaction/pull/167) [`5ee9eee`](https://github.com/sam247/openredaction/commit/5ee9eeef85a17d619ee1bc887ac5130c09775c9a) Thanks [@undsoft](https://github.com/undsoft)! - Fix IBAN detection.

  - IBANs followed by other text (e.g. `DE89370400440532013000 by Friday`, `GB82 WEST 1234 5698 7654 32 and thanks`) were not detected: the regex greedily consumed following words and validation then rejected the whole match. The IBAN regex is now generated from per-country lengths, so each country matches exactly its registered length.
  - Valid IBANs are no longer suppressed when phrases like "test iban" or "example iban" appear nearby.
  - Added the missing IBAN registry countries (e.g. BY, EG, IQ, LC, LY, RU, SC, SV, YE and French overseas territories) and corrected the Costa Rica length (22).

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
