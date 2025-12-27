/**
 * Tests for redaction modes
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Redaction Modes', () => {
  describe('Placeholder Mode (Default)', () => {
    it('should use placeholder format [TYPE_ID]', async () => {
      const shield = new OpenRedaction({ redactionMode: 'placeholder' });
      const result = await shield.detect('Contact john@example.com or call 555-123-4567');

      expect(result.redacted).toContain('[EMAIL_');
      expect(result.redacted).toContain('[PHONE_');
});
});

  describe('Mask Middle Mode', () => {
    it('should mask middle of email while preserving domain', async () => {
      const shield = new OpenRedaction({ redactionMode: 'mask-middle' });
      const result = await shield.detect('Contact john@example.com');

      // Email should be partially masked: j***@example.com
      expect(result.redacted).toMatch(/j\*+@example\.com/);
});

    it('should mask middle digits of phone number', async () => {
      const shield = new OpenRedaction({ redactionMode: 'mask-middle' });
      const result = await shield.detect('Call 555-123-4567');

      // Phone should show area code and last 4: 555-**-4567
      expect(result.redacted).toMatch(/555-\*+-4567/);
});

    it('should mask SSN showing only last 4', async () => {
      const shield = new OpenRedaction({ redactionMode: 'mask-middle' });
      const result = await shield.detect('SSN: 123-45-6789');

      // SSN should be: ***-**-6789
      expect(result.redacted).toContain('***-**-6789');
});

    it('should mask middle of credit card showing first 4 and last 4', async () => {
      const shield = new OpenRedaction({ redactionMode: 'mask-middle' });
      const result = await shield.detect('Card: 4532-1234-5678-9010');

      // Should show first 4 and last 4
      expect(result.redacted).toMatch(/4532-.*-9010/);
});
});

  describe('Mask All Mode', () => {
    it('should replace entire value with asterisks', async () => {
      const shield = new OpenRedaction({ redactionMode: 'mask-all' });
      const result = await shield.detect('Email: john@example.com');

      // Should be all asterisks matching length
      expect(result.redacted).toMatch(/Email: \*+/);
      expect(result.redacted).not.toContain('john');
      expect(result.redacted).not.toContain('example.com');
});
});

  describe('Format Preserving Mode', () => {
    it('should preserve structure with Xs', async () => {
      const shield = new OpenRedaction({ redactionMode: 'format-preserving' });
      const result = await shield.detect('SSN: 123-45-6789');

      // Should preserve dashes: XXX-XX-XXXX
      expect(result.redacted).toContain('XXX-XX-XXXX');
});

    it('should preserve email format with Xs', async () => {
      const shield = new OpenRedaction({ redactionMode: 'format-preserving' });
      const result = await shield.detect('Email: john@example.com');

      // Should preserve @ and . : xxxx@xxxxxxx.xxx
      expect(result.redacted).toMatch(/xxxx@xxxxxxx\.xxx/);
});

    it('should preserve phone number format', async () => {
      const shield = new OpenRedaction({ redactionMode: 'format-preserving' });
      const result = await shield.detect('Call (555) 123-4567');

      // Should preserve () and -: (XXX) XXX-XXXX
      expect(result.redacted).toContain('(XXX) XXX-XXXX');
});
});

  describe('Token Replace Mode', () => {
    it('should replace with realistic fake email', async () => {
      const shield = new OpenRedaction({ redactionMode: 'token-replace' });
      const result = await shield.detect('Contact john@example.com');

      // Should have a fake email with @ and domain
      expect(result.redacted).toMatch(/Contact \w+\d*@\w+\.\w+/);
      expect(result.redacted).not.toContain('john');
});

    it('should replace with fake phone number', async () => {
      const shield = new OpenRedaction({ redactionMode: 'token-replace' });
      const result = await shield.detect('Call 555-123-4567');

      // Should have a fake phone with () and -
      expect(result.redacted).toMatch(/Call \(\d{3}\) \d{3}-\d{4}/);
});

    it('should replace with fake SSN', async () => {
      const shield = new OpenRedaction({ redactionMode: 'token-replace' });
      const result = await shield.detect('SSN: 123-45-6789');

      // Should have a fake SSN with correct format
      expect(result.redacted).toMatch(/SSN: \d{3}-\d{2}-\d{4}/);
      expect(result.redacted).not.toContain('123-45-6789');
});

    it('should be deterministic for same value', async () => {
      const shield = new OpenRedaction({
        redactionMode: 'token-replace',
        deterministic: true
      });
      const result1 = await shield.detect('Email: john@example.com and john@example.com again');
      const result2 = await shield.detect('Email: john@example.com');

      // Same email should get same fake replacement
      const emails1 = result1.redacted.match(/\w+\d*@\w+\.\w+/g) || [];
      const emails2 = result2.redacted.match(/\w+\d*@\w+\.\w+/g) || [];

      expect(emails1[0]).toBe(emails1[1]); // Same in one detection
      expect(emails1[0]).toBe(emails2[0]); // Same across detections
    });
  });

  describe('Multiple Values', () => {
    it('should handle multiple PII with consistent mode', async () => {
      const shield = new OpenRedaction({ redactionMode: 'mask-middle' });
      const result = await shield.detect(
        'Contact john@example.com or jane@test.com, call 555-123-4567 or 555-987-6543'
      );

      // All should use mask-middle mode
      expect(result.redacted).toMatch(/j\*+@example\.com/);
      expect(result.redacted).toMatch(/j\*+@test\.com/);
      expect(result.redacted).toMatch(/555-\*+-4567/);
      expect(result.redacted).toMatch(/555-\*+-6543/);
    }
  }

  describe('Redaction Map', () => {
    it('should maintain redaction map regardless of mode', async () => {
      const shield = new OpenRedaction({ redactionMode: 'mask-middle' });
      const result = await shield.detect('Email: john@example.com');

      // Should still have redaction map
      expect(Object.keys(result.redactionMap).length).toBeGreaterThan(0);
      expect(Object.values(result.redactionMap)).toContain('john@example.com');
});
});
});
