import { defineConfig } from "tsdown";

export default defineConfig([
  // Library build: ESM (.mjs) + CJS (.js), dual types via outExtensions
  {
    entry: {
      index: "src/index.ts",
      lite: "src/lite.ts",
      audit: "src/audit/index.ts",
      batch: "src/batch/BatchProcessor.ts",
      documents: "src/document/index.ts",
      health: "src/health/HealthCheck.ts",
      metrics: "src/metrics/index.ts",
      rbac: "src/rbac/index.ts",
      reports: "src/reports/ReportGenerator.ts",
      streaming: "src/streaming/StreamingDetector.ts",
      tenancy: "src/tenancy/index.ts",
      webhooks: "src/webhooks/index.ts",
      workers: "src/workers/index.ts",
    },
    format: ["esm", "cjs"],
    attw: {
      profile: "node16",
    },
    dts: true,
    sourcemap: true,
    outDir: "dist",
    external: [],
    fixedExtension: false,
    outExtensions({ format }) {
      return {
        js: format === "cjs" ? ".js" : ".mjs",
        dts: format === "cjs" ? ".d.ts" : ".d.mts",
      };
    },
  },
  // Worker thread (WorkerPool loads dist/workers/worker.js)
  {
    entry: ["src/workers/worker.ts"],
    format: ["cjs"],
    outDir: "dist/workers",
    attw: {
      profile: "node16",
    },
    dts: false,
    outputOptions: {
      codeSplitting: false,
    },
  },
]);
