import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["cjs"],
    outDir: "dist",
    dts: false,
    banner: "#!/usr/bin/env node",
    outputOptions: {
      codeSplitting: false,
    },
  },
  {
    entry: { "test-pattern": "src/test-pattern.ts" },
    format: ["cjs"],
    outDir: "dist",
    dts: false,
    banner: "#!/usr/bin/env node",
    outputOptions: {
      codeSplitting: false,
    },
  },
]);
