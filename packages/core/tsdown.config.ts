import { defineConfig } from 'tsdown';

export default defineConfig([
  // Library build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outDir: 'dist',
    external: ['react', 'express'],
    fixedExtension: false
  },
  // CLI build
  {
    entry: { 'index.cli': 'src/cli/index.ts' },
    format: ['cjs'],
    outDir: 'dist',
    banner: '#!/usr/bin/env node'
  },
  // Pattern testing CLI build
  {
    entry: ['src/cli/test-pattern.ts'],
    format: ['cjs'],
    outDir: 'dist/cli',
    banner: '#!/usr/bin/env node'
  }
]);
