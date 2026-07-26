---
"@openredaction/core": major
---

Restructured package: subpath exports, profiles, and a leaner default detection set.

**Subpath exports.** The root entry now contains the detection core only. Infrastructure subsystems moved to dedicated subpaths:

| Moved symbols | New import |
| --- | --- |
| `InMemoryAuditLogger`, `ConsoleAuditLogger`, `PersistentAuditLogger`, … | `@openredaction/core/audit` |
| `BatchProcessor`, `createBatchProcessor` | `@openredaction/core/batch` |
| `DocumentProcessor`, `CsvProcessor`, `JsonProcessor`, `XlsxProcessor`, `OCRProcessor`, … | `@openredaction/core/documents` |
| `HealthChecker`, `createHealthChecker`, `healthCheckMiddleware` | `@openredaction/core/health` |
| `InMemoryMetricsCollector` | `@openredaction/core/metrics` |
| `RBACManager`, role constants, `createCustomRole`, … | `@openredaction/core/rbac` |
| `ReportGenerator`, `createReportGenerator` | `@openredaction/core/reports` |
| `StreamingDetector`, `createStreamingDetector` | `@openredaction/core/streaming` |
| `TenantManager`, tenant errors, `DEFAULT_TIER_QUOTAS` | `@openredaction/core/tenancy` |
| `WebhookManager`, `verifyWebhookSignature` | `@openredaction/core/webhooks` |
| `WorkerPool`, `createWorkerPool` | `@openredaction/core/workers` |

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
