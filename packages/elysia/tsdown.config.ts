import { defineConfig } from "tsdown";

// Elysia is ESM native so we don't need the CJS build
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["elysia", "@openredaction/core"],
  fixedExtension: false,
  outputOptions: {
    codeSplitting: false,
  },
});
