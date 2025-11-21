import { defineConfig } from 'tsup';

export default defineConfig([
  // Library build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    outDir: 'dist'
  },
  // CLI build
  {
    entry: ['src/cli/index.ts'],
    format: ['cjs'],
    outDir: 'dist',
    outExtension: () => ({ js: '.cli.js' }),
    banner: {
      js: '#!/usr/bin/env node'
    }
  }
]);
