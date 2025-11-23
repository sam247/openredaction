/**
 * Tests for result caching
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Result Caching', () => {
  describe('Cache disabled (default)', () => {
    it('should not use cache by default', () => {
      const redactor = new OpenRedaction();
      const stats = redactor.getCacheStats();

      expect(stats.enabled).toBe(false);
      expect(stats.size).toBe(0);
    });

    it('should work normally without cache', () => {
      const redactor = new OpenRedaction();
      const text = 'Contact john.smith@company.com';

      const result1 = redactor.detect(text);
      const result2 = redactor.detect(text);

      expect(result1.detections.length).toBeGreaterThan(0);
      expect(result2.detections.length).toBe(result1.detections.length);
    });
  });

  describe('Cache enabled', () => {
    it('should enable cache when requested', () => {
      const redactor = new OpenRedaction({ enableCache: true });
      const stats = redactor.getCacheStats();

      expect(stats.enabled).toBe(true);
      expect(stats.maxSize).toBe(100); // default size
    });

    it('should respect custom cache size', () => {
      const redactor = new OpenRedaction({
        enableCache: true,
        cacheSize: 50
      });

      const stats = redactor.getCacheStats();
      expect(stats.maxSize).toBe(50);
    });

    it('should return same result for identical input', () => {
      const redactor = new OpenRedaction({ enableCache: true });
      const text = 'Email: john.smith@company.com, Phone: 07700900123';

      const result1 = redactor.detect(text);
      const result2 = redactor.detect(text);

      // Results should be identical (same reference due to cache)
      expect(result2).toBe(result1);
    });

    it('should cache multiple different inputs', () => {
      const redactor = new OpenRedaction({ enableCache: true });

      const text1 = 'Email: user1@company.com';
      const text2 = 'Email: user2@company.com';
      const text3 = 'Email: user3@company.com';

      redactor.detect(text1);
      redactor.detect(text2);
      redactor.detect(text3);

      const stats = redactor.getCacheStats();
      expect(stats.size).toBe(3);
    });

    it('should improve performance on cache hits', () => {
      const redactor = new OpenRedaction({
        enableCache: true,
        enableContextAnalysis: true,
        enableMultiPass: true
      });

      const text = 'Email: john.smith@company.com, API Key: AKIA1234567890ABCDEF';

      // First call (cache miss)
      const start1 = performance.now();
      redactor.detect(text);
      const time1 = performance.now() - start1;

      // Second call (cache hit)
      const start2 = performance.now();
      redactor.detect(text);
      const time2 = performance.now() - start2;

      // Cache hit should be significantly faster
      expect(time2).toBeLessThan(time1);
      // Cache hit should be extremely fast (< 0.01ms typically)
      expect(time2).toBeLessThan(0.1);
    });

    it('should evict oldest entries when cache is full', () => {
      const redactor = new OpenRedaction({
        enableCache: true,
        cacheSize: 3 // Small cache for testing
      });

      // Add 4 entries (exceeds cache size)
      const result1 = redactor.detect('Email 1: user1@company.com');
      const result2 = redactor.detect('Email 2: user2@company.com');
      const result3 = redactor.detect('Email 3: user3@company.com');
      const result4 = redactor.detect('Email 4: user4@company.com');

      // Cache should only hold 3 entries
      const stats = redactor.getCacheStats();
      expect(stats.size).toBe(3);

      // First entry should have been evicted
      const result1Again = redactor.detect('Email 1: user1@company.com');
      expect(result1Again).not.toBe(result1); // New instance (not from cache)

      // Recent entries should still be cached
      const result4Again = redactor.detect('Email 4: user4@company.com');
      expect(result4Again).toBe(result4); // Same instance (from cache)
    });

    it('should clear cache when requested', () => {
      const redactor = new OpenRedaction({ enableCache: true });

      redactor.detect('Email: user1@company.com');
      redactor.detect('Email: user2@company.com');

      let stats = redactor.getCacheStats();
      expect(stats.size).toBe(2);

      redactor.clearCache();

      stats = redactor.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should work correctly with deterministic placeholders', () => {
      const redactor = new OpenRedaction({
        enableCache: true,
        deterministic: true
      });

      const text = 'Email: john.smith@company.com';

      const result1 = redactor.detect(text);
      const result2 = redactor.detect(text);

      expect(result2).toBe(result1); // Cached result
      expect(result1.detections[0].placeholder).toBeDefined();
      expect(result2.detections[0].placeholder).toBe(result1.detections[0].placeholder);
    });

    it('should handle cache with different text correctly', () => {
      const redactor = new OpenRedaction({ enableCache: true });

      const text1 = 'Email: user1@company.com';
      const text2 = 'Email: user2@company.com';

      const result1 = redactor.detect(text1);
      const result2 = redactor.detect(text2);

      // Should be different results
      expect(result2).not.toBe(result1);
      expect(result1.detections[0].value).not.toBe(result2.detections[0].value);

      // But re-detecting should use cache
      const result1Again = redactor.detect(text1);
      const result2Again = redactor.detect(text2);

      expect(result1Again).toBe(result1);
      expect(result2Again).toBe(result2);
    });
  });

  describe('Cache with high-volume scenarios', () => {
    it('should handle batch processing efficiently', () => {
      const redactor = new OpenRedaction({ enableCache: true });

      const texts = [
        'Email: user@company.com',
        'Phone: 07700900123',
        'Email: user@company.com', // Duplicate
        'API Key: AKIA1234567890ABCDEF',
        'Phone: 07700900123', // Duplicate
        'Email: user@company.com' // Duplicate
      ];

      const results = texts.map(text => redactor.detect(text));

      // Should have cached results for duplicates
      expect(results[0]).toBe(results[2]);
      expect(results[0]).toBe(results[5]);
      expect(results[1]).toBe(results[4]);

      // Cache should only have 3 unique entries
      const stats = redactor.getCacheStats();
      expect(stats.size).toBe(3);
    });

    it('should maintain performance with frequent cache hits', () => {
      const redactor = new OpenRedaction({
        enableCache: true,
        enableContextAnalysis: true
      });

      const commonTexts = [
        'Email: support@company.com',
        'Phone: 07700900123',
        'API Key: AKIA1234567890ABCDEF'
      ];

      // First pass: populate cache
      commonTexts.forEach(text => redactor.detect(text));

      // Second pass: should all be cache hits
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        const text = commonTexts[i % commonTexts.length];
        redactor.detect(text);
      }
      const totalTime = performance.now() - start;

      // 100 cache hits should be very fast (< 10ms total)
      expect(totalTime).toBeLessThan(10);
    });
  });
});
