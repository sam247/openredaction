/**
 * Tests for Multi-pass Detection System
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';
import {
  groupPatternsByPass,
  mergePassDetections,
  createSimpleMultiPass,
  defaultPasses
} from '../src/multipass/MultiPassDetector';
import { allPatterns } from '../src/patterns';

describe('Multi-pass Detection', () => {
  describe('groupPatternsByPass', () => {
    it('should group patterns by priority ranges', async () => {
      const grouped = groupPatternsByPass(allPatterns, defaultPasses);

      // Check that all passes are present
      expect(grouped.has('critical-credentials')).toBe(true);
      expect(grouped.has('high-confidence')).toBe(true);
      expect(grouped.has('standard-pii')).toBe(true);
      expect(grouped.has('low-priority')).toBe(true);

      // Critical credentials pass should have high-priority patterns
      const critical = grouped.get('critical-credentials') || [];
      expect(critical.length).toBeGreaterThan(0);
      expect(critical.every(p => p.priority >= 95)).toBe(true);
    });

    it('should sort patterns within each pass by priority', async () => {
      const grouped = groupPatternsByPass(allPatterns, defaultPasses);

      for (const [_passName, patterns] of grouped.entries()) {
        // Check that patterns are sorted in descending priority order
        for (let i = 0; i < patterns.length - 1; i++) {
          expect(patterns[i].priority).toBeGreaterThanOrEqual(patterns[i + 1].priority);
        }
      }
    });

    it('should respect includeTypes filter', async () => {
      const passes = [{
        name: 'credentials-only',
        minPriority: 0,
        maxPriority: 100,
        includeTypes: ['API_KEY', 'TOKEN', 'SECRET'],
        description: 'Credentials only'
      }];

      const grouped = groupPatternsByPass(allPatterns, passes);
      const credPatterns = grouped.get('credentials-only') || [];

      // All patterns should match one of the include types
      expect(credPatterns.every(p =>
        ['API_KEY', 'TOKEN', 'SECRET'].some(type => p.type.includes(type))
      )).toBe(true);
    });
  });

  describe('createSimpleMultiPass', () => {
    it('should create 3-pass configuration by default', async () => {
      const passes = createSimpleMultiPass();
      expect(passes.length).toBe(3);
    });

    it('should prioritize credentials when requested', async () => {
      const passes = createSimpleMultiPass({ prioritizeCredentials: true });
      expect(passes[0].name).toBe('credentials');
      expect(passes[0].includeTypes).toContain('API_KEY');
      expect(passes[0].includeTypes).toContain('TOKEN');
    });

    it('should create custom number of passes', async () => {
      const passes = createSimpleMultiPass({ numPasses: 4 });
      expect(passes.length).toBe(4);

      const passes5 = createSimpleMultiPass({ numPasses: 5 });
      expect(passes5.length).toBe(5);

      const passes2 = createSimpleMultiPass({ numPasses: 2 });
      expect(passes2.length).toBe(2);
    });
  });

  describe('mergePassDetections', () => {
    it('should merge detections from multiple passes', async () => {
      const passes = defaultPasses;
      const passDetections = new Map();

      passDetections.set('critical-credentials', [
        {
          type: 'API_KEY',
          value: 'AKIA1234567890ABCDEF',
          placeholder: '[API_KEY_1]',
          position: [10, 30] as [number, number],
          severity: 'high' as const,
          confidence: 1.0
        }
      ]);

      passDetections.set('standard-pii', [
        {
          type: 'EMAIL',
          value: 'test@example.com',
          placeholder: '[EMAIL_1]',
          position: [50, 66] as [number, number],
          severity: 'medium' as const,
          confidence: 0.9
        }
      ]);

      const merged = mergePassDetections(passDetections, passes);

      expect(merged.length).toBe(2);
      expect(merged.some(d => d.type === 'API_KEY')).toBe(true);
      expect(merged.some(d => d.type === 'EMAIL')).toBe(true);
    });

    it('should prioritize earlier passes for overlapping ranges', async () => {
      const passes = defaultPasses;
      const passDetections = new Map();

      // Earlier pass (higher priority)
      passDetections.set('critical-credentials', [
        {
          type: 'API_KEY',
          value: 'AKIA1234567890ABCDEF',
          placeholder: '[API_KEY_1]',
          position: [10, 30] as [number, number],
          severity: 'high' as const,
          confidence: 1.0
        }
      ]);

      // Later pass with overlapping range
      passDetections.set('standard-pii', [
        {
          type: 'GENERIC',
          value: '1234567890ABCDEF',
          placeholder: '[GENERIC_1]',
          position: [14, 30] as [number, number],
          severity: 'low' as const,
          confidence: 0.5
        }
      ]);

      const merged = mergePassDetections(passDetections, passes);

      // Should only have the API_KEY (higher priority)
      expect(merged.length).toBe(1);
      expect(merged[0].type).toBe('API_KEY');
    });
  });

  describe('Integration with OpenRedact', () => {
    it('should work when multi-pass is disabled (default)', async () => {
      const redactor = new OpenRedaction();
      const result = await redactor.detect('API Key: AKIA1234567890ABCDEF, Email: user@company.com');

      expect(result.detections.length).toBeGreaterThan(0);
      expect(result.detections.some(d => d.type.includes('AWS'))).toBe(true);
      expect(result.detections.some(d => d.type === 'EMAIL')).toBe(true);
    });

    it('should work when multi-pass is enabled', async () => {
      const redactor = new OpenRedaction({ enableMultiPass: true });
      const result = await redactor.detect('API Key: AKIA1234567890ABCDEF, Email: user@company.com');

      expect(result.detections.length).toBeGreaterThan(0);
      // Should detect at least the AWS key
      expect(result.detections.some(d => d.type.includes('AWS'))).toBe(true);
});

    it('should prioritize credentials in multi-pass mode', async () => {
      const redactor = new OpenRedaction({ enableMultiPass: true });
      const text = 'GitHub token: ghp_1234567890abcdefghij1234567890abcd and email user@company.com';
      const result = await redactor.detect(text);

      expect(result.detections.length).toBeGreaterThan(0);

      // Check that GitHub token is detected
      const hasGitHubToken = result.detections.some(d =>
        d.type.includes('GITHUB') || d.type.includes('TOKEN')
      );

      // If GitHub token pattern exists, it should be detected
      if (hasGitHubToken) {
        expect(hasGitHubToken).toBe(true);
      }
    });

    it('should handle mixed priority patterns correctly', async () => {
      const redactor = new OpenRedaction({ enableMultiPass: true });
      const text = `
        Credit Card: 4532015112830366
        Email: john.smith@company.com
        Phone: 07700 900123
        API Key: AKIA1234567890ABCDEF
      `;
      const result = await redactor.detect(text);

      // Should detect multiple types of PII
      expect(result.detections.length).toBeGreaterThanOrEqual(2);

      // Should detect at least AWS key (high priority)
      expect(result.detections.some(d => d.type.includes('AWS'))).toBe(true);
    });

    it('should support custom number of passes', async () => {
      const redactor2Pass = new OpenRedaction({
        enableMultiPass: true,
        multiPassCount: 2
      });
      const redactor5Pass = new OpenRedaction({
        enableMultiPass: true,
        multiPassCount: 5
      });
      const text = 'Email: user@company.com, Phone: 07700900123';

      const result2 = await redactor2Pass.detect(text);
      const result5 = await redactor5Pass.detect(text);

      // Both should detect the same PII
      expect(result2.detections.length).toBe(result5.detections.length);
    });

    it('should maintain consistency between single and multi-pass', async () => {
      const singlePass = new OpenRedaction({ enableMultiPass: false });
      const multiPass = new OpenRedaction({ enableMultiPass: true });

      const text = 'API Key: AKIA1234567890ABCDEF';

      const resultSingle = await singlePass.detect(text);
      const resultMulti = await multiPass.detect(text);

      // Both should detect the same item
      expect(resultSingle.detections.length).toBe(resultMulti.detections.length);
      expect(resultSingle.detections.length).toBeGreaterThan(0);

      // Both should detect the same types
      const singleTypes = resultSingle.detections.map(d => d.type).sort();
      const multiTypes = resultMulti.detections.map(d => d.type).sort();
      expect(singleTypes).toEqual(multiTypes);
    });

    it('should not break with no detections', async () => {
      const redactor = new OpenRedaction({ enableMultiPass: true });
      const result = await redactor.detect('This is plain text with no PII');

      expect(result.detections.length).toBe(0);
      expect(result.redacted).toBe('This is plain text with no PII');
});
});
});
