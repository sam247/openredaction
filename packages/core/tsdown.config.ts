import { defineConfig } from 'tsdown';

export default defineConfig([
  // Library build: ESM (.mjs) + CJS (.js), dual types via postbuild
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    outDir: 'dist',
    external: ['react', 'express'],
    fixedExtension: false,
    outExtensions({ format }) {
      return { js: format === 'cjs' ? '.js' : '.mjs' };
    },
  },
  // CLI build
  {
    entry: { 'index.cli': 'src/cli/index.ts' },
    format: ['cjs'],
    outDir: 'dist',
    dts: false,
    banner: '#!/usr/bin/env node',
  },
  // Pattern testing CLI build
  {
    entry: ['src/cli/test-pattern.ts'],
    format: ['cjs'],
    outDir: 'dist/cli',
    dts: false,
    banner: '#!/usr/bin/env node',
  },
]);
