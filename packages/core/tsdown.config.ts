import { defineConfig } from "tsdown";

export default defineConfig([
  // Library build: ESM (.mjs) + CJS (.js), dual types via postbuild
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "dist",
    external: ["react", "express"],
    fixedExtension: false,
    outputOptions: {
      codeSplitting: false,
    },
    outExtensions({ format }) {
      return { js: format === "cjs" ? ".js" : ".mjs" };
    },
  },
  // Worker thread (WorkerPool loads dist/workers/worker.js)
  {
    entry: ["src/workers/worker.ts"],
    format: ["cjs"],
    outDir: "dist/workers",
    dts: false,
    outputOptions: {
      codeSplitting: false,
    },
  },
  // React subpath: @openredaction/core/react (bundles core + hooks, react external)
  {
    entry: ["src/integrations/react.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "dist",
    clean: false,
    external: ["react"],
    fixedExtension: false,
    outputOptions: {
      codeSplitting: false,
    },
    outExtensions({ format }) {
      return { js: format === "cjs" ? ".js" : ".mjs" };
    },
  },
]);
