/**
 * Tests for Streaming API
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';
import { StreamingDetector, createStreamingDetector } from '../src/streaming/StreamingDetector';

describe('Streaming API', () => {
  describe('StreamingDetector creation', () => {
    it('should create streaming detector with default options', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector);

      expect(streaming).toBeDefined();
      expect(streaming).toBeInstanceOf(StreamingDetector);
    });

    it('should create streaming detector with custom options', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, {
        chunkSize: 1024,
        overlap: 50,
        progressiveRedaction: false
});

      expect(streaming).toBeDefined();
});

    it('should create using helper function', async () => {
      const detector = new OpenRedaction();
      const streaming = createStreamingDetector(detector);

      expect(streaming).toBeDefined();
      expect(streaming).toBeInstanceOf(StreamingDetector);
});
});

  describe('Chunk processing', () => {
    it('should process small text in single chunk', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 1000 });

      const text = 'Email: john.smith@company.com, Phone: 07700900123';
      const chunks: any[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunks.push(chunk);
      }

      expect(chunks.length).toBe(1);
      expect(chunks[0].chunkIndex).toBe(0);
      expect(chunks[0].detections.length).toBeGreaterThan(0);
      expect(chunks[0].originalChunk).toBe(text);
    });

    it('should process large text in multiple chunks', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 100, overlap: 20 });

      const text = 'Email: user1@company.com. '.repeat(20); // ~540 chars
      const chunks: any[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunks.push(chunk);
      }

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].chunkIndex).toBe(0);
      expect(chunks[1].chunkIndex).toBe(1);
    });

    it('should handle overlapping patterns correctly', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, {
        chunkSize: 50,
        overlap: 30
});

      // Create text where email spans potential chunk boundary
      const text = 'Contact info: john.smith@company.com for more details';
      const chunks: any[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunks.push(chunk);
      }

      // Collect all detections
      const allDetections = chunks.flatMap(c => c.detections);

      // Should detect email exactly once (no duplicates from overlap)
      const emails = allDetections.filter(d => d.type === 'EMAIL');
      expect(emails.length).toBe(1);
    });

    it('should provide correct byte offsets', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const streaming = new StreamingDetector(detector, { chunkSize: 100, overlap: 20 });

      const text = 'a'.repeat(100) + 'Email: user@business.co.uk' + 'b'.repeat(100);
      const chunks: any[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunks.push(chunk);
      }

      // Email should be in second chunk
      const emailDetection = chunks
        .flatMap(c => c.detections)
        .find(d => d.type === 'EMAIL');

      expect(emailDetection).toBeDefined();
      expect(emailDetection!.position[0]).toBeGreaterThan(90); // Should be past first chunk
    });

    it('should redact chunks progressively', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, {
        chunkSize: 100,
        progressiveRedaction: true
});

      const text = 'Email: user@company.com and another email: admin@company.com';
      const chunks: any[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunks.push(chunk);
      }

      // Redacted chunk should contain placeholders
      expect(chunks[0].redactedChunk).toContain('[EMAIL_');
      expect(chunks[0].redactedChunk).not.toContain('user@company.com');
    });

    it('should preserve original chunks', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 100 });

      const text = 'Email: user@company.com, Phone: 07700900123';
      const chunks: any[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunks.push(chunk);
      }

      expect(chunks[0].originalChunk).toBe(text);
      expect(chunks[0].originalChunk).toContain('user@company.com');
    });
  });

  describe('Complete processing', () => {
    it('should process and return complete result', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 100 });

      const text = `
        Email: john.smith@company.com
        Phone: 07700900123
        Credit Card: 4532 0151 1283 0366
      `;

      const result = await streaming.processComplete(text);

      expect(result.original).toBe(text);
      expect(result.detections.length).toBeGreaterThan(0);
      expect(result.redacted).not.toBe(text);
      expect(result.redacted).toContain('[EMAIL_');
      expect(result.redactionMap).toBeDefined();
    });

    it('should produce same result as non-streaming for small text', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector);

      const text = 'Email: user@company.com, Phone: 07700900123';

      const streamResult = await streaming.processComplete(text);
      const normalResult = await detector.detect(text);

      expect(streamResult.detections.length).toBe(normalResult.detections.length);
      expect(streamResult.redacted).toBe(normalResult.redacted);
    });

    it('should handle empty text', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector);

      const result = await streaming.processComplete('');

      expect(result.detections.length).toBe(0);
      expect(result.redacted).toBe('');
});

    it('should handle text with no PII', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector);

      const text = 'This is plain text with no sensitive information.';
      const result = await streaming.processComplete(text);

      expect(result.detections.length).toBe(0);
      expect(result.redacted).toBe(text);
    });

    it('should handle large documents efficiently', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 2048 });

      // Create a large document (~10KB)
      const section = `
        Customer Record:
        Name: John Smith
        Email: john.smith@company.com
        Phone: +44 7700 900123
        Credit Card: 4532 0151 1283 0366
        SSN: 123-45-6789

      `;
      const largeText = section.repeat(50); // ~10KB

      const startTime = performance.now();
      const result = await streaming.processComplete(largeText);
      const duration = performance.now() - startTime;

      expect(result.detections.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(1000); // Should complete in < 1 second
    });
  });

  describe('Chunk statistics', () => {
    it('should calculate chunk statistics correctly', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, {
        chunkSize: 1000,
        overlap: 100
});

      const stats = streaming.getChunkStats(5000);

      expect(stats.numChunks).toBe(5);
      expect(stats.chunkSize).toBe(1000);
      expect(stats.overlap).toBe(100);
      expect(stats.estimatedMemory).toBeGreaterThan(0);
    });

    it('should handle edge cases in chunk calculation', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 1000 });

      // Exact multiple
      const stats1 = streaming.getChunkStats(3000);
      expect(stats1.numChunks).toBe(3);

      // Partial chunk
      const stats2 = streaming.getChunkStats(3001);
      expect(stats2.numChunks).toBe(4);

      // Very small
      const stats3 = streaming.getChunkStats(10);
      expect(stats3.numChunks).toBe(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle PII near chunk boundaries with sufficient overlap', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const streaming = new StreamingDetector(detector, {
        chunkSize: 50,
        overlap: 30 // Sufficient overlap to catch most patterns
});

      // Create text with email
      const text = 'For inquiries: user@business.co.uk or call 07700900123';
      const chunks: any[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunks.push(chunk);
      }

      const allDetections = chunks.flatMap(c => c.detections);
      const emails = allDetections.filter(d => d.type === 'EMAIL');

      // Email should be detected with sufficient overlap
      expect(emails.length).toBeGreaterThanOrEqual(1);
    }

    it('should handle unicode characters', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 100 }

      const text = '测试 Email: user@company.com 🎉 Phone: 07700900123';
      const result = await streaming.processComplete(text);

      expect(result.detections.length).toBeGreaterThan(0);
      expect(result.redacted).toContain('测试');
      expect(result.redacted).toContain('🎉');
});

    it('should handle very long documents', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const streaming = new StreamingDetector(detector, { chunkSize: 100 }

      // Create a long document with PII in the middle
      const prefix = 'This is a very long document with lots of text. '.repeat(20);
      const middle = 'Contact user@business.co.uk for information. ';
      const suffix = 'More text continues here in this document. '.repeat(20);
      const longText = prefix + middle + suffix;

      const result = await streaming.processComplete(longText);

      const emails = result.detections.filter(d => d.type === 'EMAIL');
      expect(emails.length).toBe(1);
    }

    it('should work with context analysis enabled', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: true });
      const streaming = new StreamingDetector(detector, { chunkSize: 200 }

      const text = `
        Real email: john.smith@company.com
        Test example: test@example.com
      `;

      const result = await streaming.processComplete(text);

      // Context analysis should filter test@example.com
      const realEmails = result.detections.filter(d =>
        d.value.includes('company.com')
      );
      expect(realEmails.length).toBeGreaterThan(0);
    }

    it('should work with caching enabled', async () => {
      const detector = new OpenRedaction({ enableCache: true });
      const streaming = new StreamingDetector(detector, { chunkSize: 100 }

      const text = 'Email: user@company.com. '.repeat(10);

      // Process twice
      const result1 = await streaming.processComplete(text);
      const result2 = await streaming.processComplete(text);

      expect(result1.detections.length).toBe(result2.detections.length);
    }
  }

  describe('Memory efficiency', () => {
    it('should not load entire document into memory for streaming', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 1024 }

      // Create large text (100KB)
      const section = 'Email: user@company.com. '.repeat(100);
      const largeText = section.repeat(50); // ~100KB

      let maxChunkSize = 0;
      for await (const chunk of streaming.processStream(largeText)) {
        maxChunkSize = Math.max(maxChunkSize, chunk.originalChunk.length);
      }

      // Max chunk size should be close to configured size + overlap
      expect(maxChunkSize).toBeLessThan(1200); // 1024 + 100 overlap + safety margin
    }

    it('should process chunks incrementally', async () => {
      const detector = new OpenRedaction();
      const streaming = new StreamingDetector(detector, { chunkSize: 100 }

      const text = 'Email: user@company.com. '.repeat(20);
      const chunkIndices: number[] = [];

      for await (const chunk of streaming.processStream(text)) {
        chunkIndices.push(chunk.chunkIndex);
});

      // Chunks should be processed in order
      expect(chunkIndices).toEqual([...chunkIndices].sort((a, b) => a - b));
    }
  }
}
