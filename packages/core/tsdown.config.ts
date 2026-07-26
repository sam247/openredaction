import { defineConfig } from "tsdown";

export default defineConfig([
  // Library build: ESM (.mjs) + CJS (.js), dual types via outExtensions
  {
    entry: ["src/index.ts", "src/lite.ts"],
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
