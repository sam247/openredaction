import { defineConfig } from "tsdown";

export default defineConfig([
  // Main entry: re-exports core + express
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "dist",
    attw: {
      profile: "node16",
    },
    external: [
      "@openredaction/core",
      "@openredaction/express",
      "@openredaction/react",
      "@openredaction/server",
    ],
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
  // React subpath: re-exports @openredaction/react
  {
    entry: ["src/react.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "dist",
    clean: false,
    external: ["@openredaction/react", "react"],
    fixedExtension: false,
    attw: {
      profile: "node16",
    },
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
  // Server subpath: re-exports @openredaction/server
  {
    entry: ["src/server.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "dist",
    clean: false,
    attw: {
      profile: "node16",
    },
    external: ["@openredaction/server"],
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
]);
