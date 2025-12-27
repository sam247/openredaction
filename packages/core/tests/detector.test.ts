import { describe, it, expect, beforeEach } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('OpenRedact', () => {
  let shield: OpenRedact;

  beforeEach(() => {
    shield = new OpenRedaction();
  });

  describe('Basic detection', () => {
    it('should detect email addresses', async () => {
      const result = await shield.detect('Contact john@example.com for info');

      expect(result.detections).toHaveLength(1);
      expect(result.detections[0].type).toBe('EMAIL');
      expect(result.detections[0].value).toBe('john@example.com');
      expect(result.redacted).toContain('[EMAIL_');
    });

    it('should detect multiple PII types', async () => {
      const text = 'Email john@example.com or call 07700900123';
      const result = await shield.detect(text);

      expect(result.detections.length).toBeGreaterThanOrEqual(2);
      expect(result.detections.some(d => d.type === 'EMAIL')).toBe(true);
      expect(result.detections.some(d => d.type.includes('PHONE'))).toBe(true);
    });

    it('should detect credit card numbers with Luhn validation', async () => {
      const result = await shield.detect('Card: 4532015112830366');

      const creditCard = result.detections.find(d => d.type === 'CREDIT_CARD');
      expect(creditCard).toBeDefined();
      expect(creditCard?.value).toBe('4532015112830366');
    });

    it('should not detect invalid credit card numbers', async () => {
      const result = await shield.detect('Card: 1234567890123456');

      const creditCard = result.detections.find(d => d.type === 'CREDIT_CARD');
      expect(creditCard).toBeUndefined();
    });
  });

  describe('Redaction', () => {
    it('should redact detected PII', async () => {
      const text = 'Contact john@example.com for info';
      const result = await shield.detect(text);

      expect(result.redacted).not.toContain('john@example.com');
      expect(result.redacted).toMatch(/Contact \[EMAIL_\d+\] for info/);
    });

    it('should build redaction map', async () => {
      const text = 'Email: john@example.com';
      const result = await shield.detect(text);

      expect(Object.keys(result.redactionMap)).toHaveLength(1);
      expect(Object.values(result.redactionMap)[0]).toBe('john@example.com');
    });

    it('should handle multiple instances of same PII type', async () => {
      const text = 'Email john@example.com or jane@example.com';
      const result = await shield.detect(text);

      expect(result.detections).toHaveLength(2);
      expect(result.detections.every(d => d.type === 'EMAIL')).toBe(true);
    });
  });

  describe('Restoration', () => {
    it('should restore redacted text', async () => {
      const original = 'Contact john@example.com for info';
      const result = await shield.detect(original);
      const restored = shield.restore(result.redacted, result.redactionMap);

      expect(restored).toBe(original);
    });

    it('should restore multiple PII instances', async () => {
      const original = 'Email john@example.com or call 07700900123';
      const result = await shield.detect(original);
      const restored = shield.restore(result.redacted, result.redactionMap);

      expect(restored).toBe(original);
    });
  });

  describe('Deterministic placeholders', () => {
    it('should generate same placeholder for same value', async () => {
      const shield = new OpenRedaction({
        deterministic: true,
        enableContextAnalysis: false  // Disable context analysis for this test
      });
      const text = 'john@example.com and john@example.com';
      const result = await shield.detect(text);

      expect(result.detections).toHaveLength(2);
      const placeholders = result.detections.map(d => d.placeholder);
      expect(placeholders[0]).toBe(placeholders[1]);
    });

    it('should generate different placeholders for different values', async () => {
      const shield = new OpenRedaction({
        deterministic: true,
        enableContextAnalysis: false  // Disable context analysis for this test
      });
      const text = 'john@example.com and jane@example.com';
      const result = await shield.detect(text);

      expect(result.detections).toHaveLength(2);
      const placeholders = result.detections.map(d => d.placeholder);
      expect(placeholders[0]).not.toBe(placeholders[1]);
    });

    it('should use incremental counters in non-deterministic mode', async () => {
      const shield = new OpenRedaction({
        deterministic: false,
        enableContextAnalysis: false  // Disable context analysis for this test
      });
      const text = 'john@example.com and john@example.com';
      const result = await shield.detect(text);

      expect(result.detections).toHaveLength(2);
      // In non-deterministic mode, same value might get different placeholders
    });
  });

  describe('Options', () => {
    it('should respect includeEmails option', async () => {
      const shieldNoEmails = new OpenRedaction({ includeEmails: false });
      const result = await shieldNoEmails.detect('Email: john@example.com');

      expect(result.detections.find(d => d.type === 'EMAIL')).toBeUndefined();
    });

    it('should respect pattern whitelist', async () => {
      const shieldEmailOnly = new OpenRedaction({ patterns: ['EMAIL'] });
      const result = await shieldEmailOnly.detect('Email john@example.com call 07700900123');

      expect(result.detections).toHaveLength(1);
      expect(result.detections[0].type).toBe('EMAIL');
    });

    it('should respect whitelist option', async () => {
      const shieldWithWhitelist = new OpenRedaction({ whitelist: ['example.com'] });
      const result = await shieldWithWhitelist.detect('Email john@example.com');

      expect(result.detections).toHaveLength(0);
    });

    it('should support custom patterns', async () => {
      const shieldWithCustom = new OpenRedaction({
        customPatterns: [{
          type: 'CUSTOM_ID',
          regex: /CUSTOM-\d{6}/g,
          priority: 100,
          placeholder: '[CUSTOM_{n}]',
          severity: 'high'
        }]
      });

      const result = await shieldWithCustom.detect('ID: CUSTOM-123456');
      expect(result.detections.some(d => d.type === 'CUSTOM_ID')).toBe(true);
    });
  });

  describe('Scan method', () => {
    it('should categorize by severity', async () => {
      const text = 'Email john@example.com SSN 123-45-6789 ZIP 12345';
      const scan = await shield.scan(text);

      expect(scan.high.length).toBeGreaterThan(0);
      expect(scan.total).toBeGreaterThan(0);
    });
  });

  describe('Statistics', () => {
    it('should include processing time', async () => {
      const result = await shield.detect('Email: john@example.com');

      expect(result.stats).toBeDefined();
      expect(result.stats?.processingTime).toBeGreaterThan(0);
    });

    it('should include PII count', async () => {
      const result = await shield.detect('Email john@example.com call 07700900123');

      expect(result.stats?.piiCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Priority handling', () => {
    it('should not detect overlapping patterns twice', async () => {
      const text = 'Contact: john@example.com';
      const result = await shield.detect(text);

      // Each PII should only be detected once
      const positions = result.detections.map(d => d.position);
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const [start1, end1] = positions[i];
          const [start2, end2] = positions[j];
          const overlaps = (start1 < end2 && start2 < end1);
          expect(overlaps).toBe(false);
        }
      }
    });
  });

  describe('Presets', () => {
    it('should apply GDPR preset', () => {
      const gdprShield = new OpenRedaction({ preset: 'gdpr' });
      const patterns = gdprShield.getPatterns();

      expect(patterns.some(p => p.type === 'EMAIL')).toBe(true);
      expect(patterns.some(p => p.type === 'IBAN')).toBe(true);
    });

    it('should apply HIPAA preset', () => {
      const hipaaShield = new OpenRedaction({ preset: 'hipaa' });
      const patterns = hipaaShield.getPatterns();

      expect(patterns.some(p => p.type === 'SSN')).toBe(true);
      expect(patterns.some(p => p.type === 'EMAIL')).toBe(true);
    });

    it('should apply CCPA preset', () => {
      const ccpaShield = new OpenRedaction({ preset: 'ccpa' });
      const patterns = ccpaShield.getPatterns();

      expect(patterns.some(p => p.type === 'EMAIL')).toBe(true);
      expect(patterns.some(p => p.type === 'SSN')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', async () => {
      const result = await shield.detect('');

      expect(result.detections).toHaveLength(0);
      expect(result.redacted).toBe('');
    });

    it('should handle text with no PII', async () => {
      const result = await shield.detect('This is a simple text without any sensitive data');

      expect(result.detections).toHaveLength(0);
      expect(result.redacted).toBe('This is a simple text without any sensitive data');
    });

    it('should handle very long text', async () => {
      const longText = 'Some text. '.repeat(1000) + 'Email: john@example.com';
      const result = await shield.detect(longText);

      expect(result.detections.some(d => d.type === 'EMAIL')).toBe(true);
    });

    it('should handle special characters', async () => {
      const text = 'Email: john+tag@example.com!!!';
      const result = await shield.detect(text);

      expect(result.detections.some(d => d.type === 'EMAIL')).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should process text quickly', async () => {
      const text = 'Email john@example.com or call 07700900123. SSN: 123-45-6789.';
      const result = await shield.detect(text);

      // With security features (validation, pre-compilation, safe execution),
      // processing time is still excellent at <100ms for small text
      expect(result.stats?.processingTime).toBeLessThan(100);
    });

    it('should benefit from pre-compiled patterns on repeated calls', async () => {
      const text = 'Email john@example.com';

      // First call (includes any warmup)
      const result1 = await shield.detect(text);
      const time1 = result1.stats?.processingTime || 0;

      // Second call should be as fast or faster (patterns already compiled)
      const result2 = await shield.detect(text);
      const time2 = result2.stats?.processingTime || 0;

      // Both should be reasonably fast
      expect(time1).toBeLessThan(150);
      expect(time2).toBeLessThan(150);

      // Verify both detected the email
      expect(result1.detections.length).toBeGreaterThan(0);
      expect(result2.detections.length).toBeGreaterThan(0);
    });
  });
});
