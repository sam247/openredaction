/**
 * Tests for Middle East ID patterns
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Middle East National ID Detection', () => {
  describe('UAE Emirates ID', () => {
    it('should detect UAE Emirates ID', async () => {
      const detector = new OpenRedaction({ patterns: ['UAE_EMIRATES_ID'] });
      const result = await detector.detect('Emirates ID: 784-1990-1234567-1');
      expect(result.detections.some(d => d.type === 'UAE_EMIRATES_ID')).toBe(true);
});

    it('should detect UAE Emirates ID without dashes', async () => {
      const detector = new OpenRedaction({ patterns: ['UAE_EMIRATES_ID'] });
      const result = await detector.detect('UAE ID 784199012345671');
      expect(result.detections.some(d => d.type === 'UAE_EMIRATES_ID')).toBe(true);
});

    it('should require 784 prefix', async () => {
      const detector = new OpenRedaction({ patterns: ['UAE_EMIRATES_ID'] });
      const result = await detector.detect('ID: 123-1990-1234567-1 in context');
      expect(result.detections.some(d => d.type === 'UAE_EMIRATES_ID')).toBe(false);
});

    it('should require context validation', async () => {
      const detector = new OpenRedaction({ patterns: ['UAE_EMIRATES_ID'] });
      const result = await detector.detect('Random number: 784199012345671');
      expect(result.detections.some(d => d.type === 'UAE_EMIRATES_ID')).toBe(false);
});
});

  describe('Saudi Arabia National ID', () => {
    it('should detect Saudi National ID', async () => {
      const detector = new OpenRedaction({ patterns: ['SAUDI_NATIONAL_ID'] });
      const result = await detector.detect('Saudi ID: 1234567890');
      expect(result.detections.some(d => d.type === 'SAUDI_NATIONAL_ID')).toBe(true);
});

    it('should detect Iqama (resident ID starting with 2)', async () => {
      const detector = new OpenRedaction({ patterns: ['SAUDI_NATIONAL_ID'] });
      const result = await detector.detect('Iqama number: 2123456789');
      expect(result.detections.some(d => d.type === 'SAUDI_NATIONAL_ID')).toBe(true);
});

    it('should require starting with 1 or 2', async () => {
      const detector = new OpenRedaction({ patterns: ['SAUDI_NATIONAL_ID'] });
      const result = await detector.detect('ID: 3234567890');
      expect(result.detections.some(d => d.type === 'SAUDI_NATIONAL_ID')).toBe(false);
});

    it('should require context validation', async () => {
      const detector = new OpenRedaction({ patterns: ['SAUDI_NATIONAL_ID'] });
      const result = await detector.detect('Phone: 1234567890');
      expect(result.detections.some(d => d.type === 'SAUDI_NATIONAL_ID')).toBe(false);
});
});

  describe('Israel Teudat Zehut', () => {
    it('should detect Israeli ID in proper context', async () => {
      const detector = new OpenRedaction({ patterns: ['ISRAEL_ID'] });
      // Israeli ID with context
      const result = await detector.detect('Israeli Teudat Zehut: 123456780');
      expect(result.detections.some(d => d.type === 'ISRAEL_ID')).toBe(true);
});

    it('should require context validation', async () => {
      const detector = new OpenRedaction({ patterns: ['ISRAEL_ID'] });
      const result = await detector.detect('Random number: 123456780');
      expect(result.detections.some(d => d.type === 'ISRAEL_ID')).toBe(false);
});

    it('should be 9 digits', async () => {
      const detector = new OpenRedaction({ patterns: ['ISRAEL_ID'] });
      const result = await detector.detect('Israeli ID: 12345678'); // Only 8 digits
      expect(result.detections.some(d => d.type === 'ISRAEL_ID')).toBe(false);
});
});

  describe('Turkey TC Kimlik No', () => {
    it('should detect Turkish ID in proper context', async () => {
      const detector = new OpenRedaction({ patterns: ['TURKEY_ID'] });
      const result = await detector.detect('TC Kimlik No: 12345678901');
      expect(result.detections.some(d => d.type === 'TURKEY_ID')).toBe(true);
});

    it('should reject ID starting with 0', async () => {
      const detector = new OpenRedaction({ patterns: ['TURKEY_ID'] });
      const result = await detector.detect('Turkish ID: 02345678901');
      expect(result.detections.some(d => d.type === 'TURKEY_ID')).toBe(false);
});

    it('should require context validation', async () => {
      const detector = new OpenRedaction({ patterns: ['TURKEY_ID'] });
      const result = await detector.detect('Number: 12345678901');
      expect(result.detections.some(d => d.type === 'TURKEY_ID')).toBe(false);
});
});

  describe('Qatar ID (QID)', () => {
    it('should detect Qatar ID', async () => {
      const detector = new OpenRedaction({ patterns: ['QATAR_ID'] });
      const result = await detector.detect('QID: 12345678901');
      expect(result.detections.some(d => d.type === 'QATAR_ID')).toBe(true);
});

    it('should require 11 digits', async () => {
      const detector = new OpenRedaction({ patterns: ['QATAR_ID'] });
      const result = await detector.detect('QID: 1234567890');
      expect(result.detections.some(d => d.type === 'QATAR_ID')).toBe(false);
});

    it('should require context validation', async () => {
      const detector = new OpenRedaction({ patterns: ['QATAR_ID'] });
      const result = await detector.detect('Random: 12345678901');
      expect(result.detections.some(d => d.type === 'QATAR_ID')).toBe(false);
});
});

  describe('Kuwait Civil ID', () => {
    it('should detect Kuwait Civil ID in proper context', async () => {
      const detector = new OpenRedaction({ patterns: ['KUWAIT_CIVIL_ID'] });
      const result = await detector.detect('Kuwait Civil ID: 290101112345');
      expect(result.detections.some(d => d.type === 'KUWAIT_CIVIL_ID')).toBe(true);
});

    it('should require 12 digits', async () => {
      const detector = new OpenRedaction({ patterns: ['KUWAIT_CIVIL_ID'] });
      const result = await detector.detect('Kuwait ID: 29010111234'); // Only 11 digits
      expect(result.detections.some(d => d.type === 'KUWAIT_CIVIL_ID')).toBe(false);
});

    it('should require context validation', async () => {
      const detector = new OpenRedaction({ patterns: ['KUWAIT_CIVIL_ID'] });
      const result = await detector.detect('Number: 290101112345');
      expect(result.detections.some(d => d.type === 'KUWAIT_CIVIL_ID')).toBe(false);
});
});

  describe('Bahrain CPR', () => {
    it('should detect Bahrain CPR in proper context', async () => {
      const detector = new OpenRedaction({ patterns: ['BAHRAIN_CPR'] });
      const result = await detector.detect('Bahrain CPR: 850101123');
      expect(result.detections.some(d => d.type === 'BAHRAIN_CPR')).toBe(true);
});

    it('should require 9 digits', async () => {
      const detector = new OpenRedaction({ patterns: ['BAHRAIN_CPR'] });
      const result = await detector.detect('Bahrain CPR: 85010112'); // Only 8 digits
      expect(result.detections.some(d => d.type === 'BAHRAIN_CPR')).toBe(false);
});

    it('should require context validation', async () => {
      const detector = new OpenRedaction({ patterns: ['BAHRAIN_CPR'] });
      const result = await detector.detect('Random: 850101123');
      expect(result.detections.some(d => d.type === 'BAHRAIN_CPR')).toBe(false);
});
});

  describe('Integration: Multiple Middle East IDs', () => {
    it('should detect multiple Middle East IDs in one text', async () => {
      const detector = new OpenRedaction();
      const text = `
        UAE Emirates ID: 784-1990-1234567-1
        Saudi Arabia national ID: 1234567890
        Turkey TC Kimlik national ID: 12345678901
        Kuwait Civil ID number: 290101112345
      `;

      const result = await detector.detect(text);

      expect(result.detections.some(d => d.type === 'UAE_EMIRATES_ID')).toBe(true);
      expect(result.detections.some(d => d.type === 'SAUDI_NATIONAL_ID')).toBe(true);
      expect(result.detections.some(d => d.type === 'TURKEY_ID')).toBe(true);
      expect(result.detections.some(d => d.type === 'KUWAIT_CIVIL_ID')).toBe(true);
    });
  });
});
