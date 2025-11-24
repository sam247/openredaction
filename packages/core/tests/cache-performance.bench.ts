/**
 * Cache performance benchmarks
 * Demonstrates the performance benefit of caching
 */

import { describe, bench } from 'vitest';
import { OpenRedaction } from '../src/detector';

const commonText = `
Application Security Audit Report

API Keys:
- AWS Access Key: AKIA1234567890ABCDEF
- GitHub Token: ghp_abcdefghijklmnopqrstuvwxyz1234567890

Contact Information:
- Email: admin@company.com
- Phone: +44 7700 900123
`;

describe('Cache Performance', () => {
  describe('Single repeated detection', () => {
    bench('without cache', () => {
      const redactor = new OpenRedaction({ enableCache: false });
      redactor.detect(commonText);
    });

    bench('with cache (first call - cache miss)', () => {
      const redactor = new OpenRedaction({ enableCache: true });
      redactor.clearCache();
      redactor.detect(commonText);
    });

    bench('with cache (subsequent calls - cache hit)', () => {
      const redactor = new OpenRedaction({ enableCache: true });
      redactor.detect(commonText); // Prime cache
      redactor.detect(commonText); // Benchmark this
    });
  });

  describe('Batch processing with duplicates', () => {
    const texts = [
      'Email: user@company.com',
      'Phone: 07700900123',
      'Email: user@company.com', // Duplicate
      'API Key: AKIA1234567890ABCDEF',
      'Phone: 07700900123' // Duplicate
    ];

    bench('without cache', () => {
      const redactor = new OpenRedaction({ enableCache: false });
      for (const text of texts) {
        redactor.detect(text);
      }
    });

    bench('with cache', () => {
      const redactor = new OpenRedaction({ enableCache: true });
      for (const text of texts) {
        redactor.detect(text);
      }
    });
  });

  describe('High-volume repeated detection', () => {
    const text = 'Contact support@company.com or call 07700900123';

    bench('100 calls without cache', () => {
      const redactor = new OpenRedaction({ enableCache: false });
      for (let i = 0; i < 100; i++) {
        redactor.detect(text);
      }
    });

    bench('100 calls with cache', () => {
      const redactor = new OpenRedaction({ enableCache: true });
      for (let i = 0; i < 100; i++) {
        redactor.detect(text);
      }
    });
  });

  describe('Cache with all features enabled', () => {
    bench('without cache - all features', () => {
      const redactor = new OpenRedaction({
        enableCache: false,
        enableContextAnalysis: true,
        enableFalsePositiveFilter: true,
        enableMultiPass: true
      });
      redactor.detect(commonText);
    });

    bench('with cache - all features (cache hit)', () => {
      const redactor = new OpenRedaction({
        enableCache: true,
        enableContextAnalysis: true,
        enableFalsePositiveFilter: true,
        enableMultiPass: true
      });
      redactor.detect(commonText); // Prime cache
      redactor.detect(commonText); // Benchmark this
    });
  });
});
