/**
 * Tests for Batch Processing
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';
import { BatchProcessor, createBatchProcessor } from '../src/batch/BatchProcessor';

describe('Batch Processing', () => {
  describe('BatchProcessor creation', () => {
    it('should create batch processor', () => {
      const detector = new OpenRedaction();
      const batch = new BatchProcessor(detector);

      expect(batch).toBeDefined();
      expect(batch).toBeInstanceOf(BatchProcessor);
    });

    it('should create using helper function', () => {
      const detector = new OpenRedaction();
      const batch = createBatchProcessor(detector);

      expect(batch).toBeDefined();
      expect(batch).toBeInstanceOf(BatchProcessor);
    });
  });

  describe('Sequential processing', () => {
    it('should process multiple documents sequentially', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = [
        'Email: user1@business.co.uk',
        'Phone: 07700900123',
        'Credit Card: 4532 0151 1283 0366'
      ];

      const result = batch.processSequential(documents);

      expect(result.results.length).toBe(3);
      expect(result.stats.totalDocuments).toBe(3);
      expect(result.stats.totalDetections).toBeGreaterThan(0);
      expect(result.stats.totalTime).toBeGreaterThan(0);
      expect(result.stats.avgTimePerDocument).toBeGreaterThan(0);
    });

    it('should call progress callback', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = ['Email: test1@business.co.uk', 'Email: test2@business.co.uk'];
      const progressCalls: Array<{completed: number; total: number}> = [];

      batch.processSequential(documents, {
        onProgress: (completed, total) => {
          progressCalls.push({ completed, total });
        }
      });

      expect(progressCalls.length).toBe(2);
      expect(progressCalls[0]).toEqual({ completed: 1, total: 2 });
      expect(progressCalls[1]).toEqual({ completed: 2, total: 2 });
    });

    it('should handle empty array', () => {
      const detector = new OpenRedaction();
      const batch = new BatchProcessor(detector);

      const result = batch.processSequential([]);

      expect(result.results.length).toBe(0);
      expect(result.stats.totalDocuments).toBe(0);
      expect(result.stats.totalDetections).toBe(0);
    });

    it('should handle documents with no PII', () => {
      const detector = new OpenRedaction();
      const batch = new BatchProcessor(detector);

      const documents = [
        'This is plain text',
        'Another plain document',
        'Nothing sensitive here'
      ];

      const result = batch.processSequential(documents);

      expect(result.results.length).toBe(3);
      expect(result.stats.totalDetections).toBe(0);
    });
  });

  describe('Parallel processing', () => {
    it('should process multiple documents in parallel', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = [
        'Email: user1@business.co.uk',
        'Phone: 07700900123',
        'Credit Card: 4532 0151 1283 0366',
        'SSN: 123-45-6789'
      ];

      const result = await batch.processParallel(documents);

      expect(result.results.length).toBe(4);
      expect(result.stats.totalDocuments).toBe(4);
      expect(result.stats.totalDetections).toBeGreaterThan(0);
    });

    it('should respect max concurrency', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = Array(10).fill('Email: test@business.co.uk');

      const result = await batch.processParallel(documents, {
        maxConcurrency: 2
      });

      expect(result.results.length).toBe(10);
      expect(result.stats.totalDocuments).toBe(10);
    });

    it('should call progress callback in parallel mode', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = ['Email: test1@business.co.uk', 'Email: test2@business.co.uk'];
      let completedCount = 0;

      await batch.processParallel(documents, {
        onProgress: (completed, total) => {
          completedCount = completed;
          expect(total).toBe(2);
        }
      });

      expect(completedCount).toBe(2);
    });
  });

  describe('Automatic processing', () => {
    it('should use sequential by default', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = ['Email: user@business.co.uk', 'Phone: 07700900123'];

      const result = await batch.process(documents);

      expect(result.results.length).toBe(2);
    });

    it('should use parallel when requested', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = ['Email: user@business.co.uk', 'Phone: 07700900123'];

      const result = await batch.process(documents, { parallel: true });

      expect(result.results.length).toBe(2);
    });
  });

  describe('Stream processing', () => {
    it('should process documents as stream', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = [
        'Email: user1@business.co.uk',
        'Email: user2@business.co.uk',
        'Email: user3@business.co.uk'
      ];

      const results = [];
      for await (const result of batch.processStream(documents)) {
        results.push(result);
      }

      expect(results.length).toBe(3);
      expect(results.every(r => r.detections.length > 0)).toBe(true);
    });

    it('should respect batch size in stream', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = Array(25).fill('Email: test@business.co.uk');
      const batchSize = 10;

      const results = [];
      for await (const result of batch.processStream(documents, batchSize)) {
        results.push(result);
      }

      expect(results.length).toBe(25);
    });
  });

  describe('Aggregated statistics', () => {
    it('should provide aggregated stats', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = [
        'Email: user@business.co.uk',
        'Phone: 07700900123',
        'Email: admin@business.co.uk'
      ];

      const batchResult = batch.processSequential(documents);
      const stats = batch.getAggregatedStats(batchResult.results);

      expect(stats.totalDetections).toBeGreaterThan(0);
      expect(stats.detectionsByType).toBeDefined();
      expect(stats.detectionsBySeverity).toBeDefined();
      expect(stats.detectionsByType['EMAIL']).toBeGreaterThan(0);
    });

    it('should calculate average confidence', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: true });
      const batch = new BatchProcessor(detector);

      const documents = [
        'Email: user@business.co.uk',
        'Email: admin@business.co.uk'
      ];

      const batchResult = batch.processSequential(documents);
      const stats = batch.getAggregatedStats(batchResult.results);

      expect(stats.avgConfidence).toBeGreaterThan(0);
      expect(stats.avgConfidence).toBeLessThanOrEqual(1);
    });

    it('should group by severity', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = [
        'Email: user@business.co.uk',           // high
        'Credit Card: 4532 0151 1283 0366'      // high
      ];

      const batchResult = batch.processSequential(documents);
      const stats = batch.getAggregatedStats(batchResult.results);

      expect(stats.detectionsBySeverity['high']).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should handle large batches efficiently', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = Array(1000).fill('Email: test@business.co.uk');

      const startTime = performance.now();
      const result = batch.processSequential(documents);
      const duration = performance.now() - startTime;

      expect(result.results.length).toBe(1000);
      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    });
  });

  describe('Integration with caching', () => {
    it('should benefit from caching for duplicate documents', () => {
      const detector = new OpenRedaction({
        enableCache: true,
        enableContextAnalysis: false
      });
      const batch = new BatchProcessor(detector);

      // Many duplicate documents
      const documents = Array(100).fill('Email: test@business.co.uk, Phone: 07700900123');

      const result = batch.processSequential(documents);

      expect(result.results.length).toBe(100);
      // With caching, this should be very fast
      expect(result.stats.avgTimePerDocument).toBeLessThan(1); // < 1ms per doc with cache
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle mixed document types', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = [
        'Customer email: john.smith@customer.com',
        'Support ticket: Call 07700900123 for assistance',
        'Payment info: Card 4532 0151 1283 0366',
        'Plain text document with no PII',
        'Employee SSN: 123-45-6789'
      ];

      const result = await batch.process(documents);

      expect(result.results.length).toBe(5);
      expect(result.stats.totalDetections).toBeGreaterThan(3); // At least 4 documents with PII
    });

    it('should provide useful statistics for compliance reporting', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const batch = new BatchProcessor(detector);

      const documents = [
        'User: john@customer.com, Card: 4532015112830366',
        'Support: admin@customer.com, Phone: 07700900123',
        'Employee: staff@customer.com, SSN: 123-45-6789'
      ];

      const result = batch.processSequential(documents);
      const stats = batch.getAggregatedStats(result.results);

      // Should have detected various PII types
      expect(Object.keys(stats.detectionsByType).length).toBeGreaterThan(2);
      expect(stats.totalDetections).toBeGreaterThan(5);
    });
  });
});
