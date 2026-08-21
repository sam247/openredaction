import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  outDir: "dist",
  external: ["express", "@openredaction/core"],
  fixedExtension: false,
  outputOptions: {
    codeSplitting: false,
  },
  attw: {
    profile: "node16",
  },
  outExtensions({ format }) {
    return {
      js: format === "cjs" ? ".js" : ".mjs",
      dts: format === "cjs" ? ".d.ts" : ".d.mts",
    };
  },
});
