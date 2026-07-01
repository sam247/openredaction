import { defineConfig } from "tsdown";

export default defineConfig([
  // Library entry (exports)
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "dist",
    external: ["@openredaction/core"],
    fixedExtension: false,
    outputOptions: {
      codeSplitting: false,
    },
    outExtensions({ format }) {
      return {
        js: format === "cjs" ? ".js" : ".mjs",
        dts: format === "cjs" ? ".d.ts" : ".d.mts",
      };
    },
  },
  // CLI binary
  {
    entry: { "index.cli": "src/cli.ts" },
    format: ["cjs"],
    outDir: "dist",
    dts: false,
    banner: "#!/usr/bin/env node",
    external: ["@openredaction/core"],
    outputOptions: {
      codeSplitting: false,
    },
  },
  // Pattern testing CLI binary
  {
    entry: ["src/test-pattern.ts"],
    format: ["cjs"],
    outDir: "dist",
    dts: false,
    banner: "#!/usr/bin/env node",
    external: ["@openredaction/core"],
    outputOptions: {
      codeSplitting: false,
    },
  },
]);
