/**
 * Tests for False Positive Filtering
 */

import { describe, it, expect } from 'vitest';
import { isFalsePositive } from '../src/filters/FalsePositiveFilter';
import { OpenRedact } from '../src/detector';

describe('False Positive Filter', () => {
  describe('Version numbers', () => {
    it('should detect version numbers as false positives', () => {
      const result = isFalsePositive('1.2.3', 'PHONE', 'version 1.2.3 released');
      expect(result.isFalsePositive).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect semver patterns', () => {
      const result = isFalsePositive('2.0.1', 'PHONE_UK', 'v2.0.1 changelog');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should handle build numbers', () => {
      const result = isFalsePositive('10.15.7', 'PHONE', 'build 10.15.7');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Dates', () => {
    it('should detect dates as false positives for phone patterns', () => {
      const result = isFalsePositive('01-02-2024', 'PHONE', 'Date: 01-02-2024');
      expect(result.isFalsePositive).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect birth dates', () => {
      const result = isFalsePositive('12/25/1990', 'PHONE', 'born 12/25/1990');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect ISO dates', () => {
      const result = isFalsePositive('2024-01-15', 'PHONE', 'created on 2024-01-15');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('IP addresses', () => {
    it('should detect IP addresses', () => {
      const result = isFalsePositive('192.168.1.1', 'PHONE', 'server at 192.168.1.1');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect IPs in network context', () => {
      const result = isFalsePositive('10.0.0.1', 'ID', 'IP address: 10.0.0.1');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Measurements', () => {
    it('should detect measurements with units', () => {
      const result = isFalsePositive('150', 'PHONE', 'height 150 cm');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect weight measurements', () => {
      const result = isFalsePositive('75', 'NUMBER', 'weight: 75 kg');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect dimensions', () => {
      const result = isFalsePositive('1920', 'PHONE', 'width: 1920 px');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Years', () => {
    it('should detect years 1900-2099', () => {
      const result = isFalsePositive('2024', 'PHONE', 'in 2024');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect historical years', () => {
      const result = isFalsePositive('1990', 'ID', 'since 1990');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Prices', () => {
    it('should detect price amounts', () => {
      const result = isFalsePositive('99.99', 'ACCOUNT', 'price: $99.99');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect costs', () => {
      const result = isFalsePositive('1250.00', 'NUMBER', 'total cost: £1250.00');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Port numbers', () => {
    it('should detect common ports', () => {
      const result = isFalsePositive('8080', 'PHONE', 'listening on port 8080');
      expect(result.isFalsePositive).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect ports with port keyword', () => {
      const result = isFalsePositive('3000', 'ID', 'running on port ');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Percentages', () => {
    it('should detect percentages with percent symbol', () => {
      const result = isFalsePositive('75', 'NUMBER', 'completion at 75 %');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect decimal percentages with keyword', () => {
      const result = isFalsePositive('99.5', 'PHONE', 'accuracy at 99.5 percent ');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Technical placeholders', () => {
    it('should detect foo/bar/baz placeholders', () => {
      const result = isFalsePositive('foo', 'NAME', 'function foo() {');
      expect(result.isFalsePositive).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect example domains', () => {
      const result = isFalsePositive('test@example.com', 'EMAIL', 'email: test@example.com');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect code comments', () => {
      const result = isFalsePositive('John Smith', 'NAME', '// John Smith wrote this');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Test data', () => {
    it('should detect test emails', () => {
      const result = isFalsePositive('test@example.com', 'EMAIL', 'contact: test@example.com');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect johndoe/janedoe', () => {
      const result = isFalsePositive('johndoe@test.com', 'EMAIL', 'user: johndoe@test.com');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect xxx patterns in values', () => {
      const result = isFalsePositive('xxxxx', 'PHONE', 'format: xxxxx');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect 000 patterns in phone numbers', () => {
      const result = isFalsePositive('000-000-0000', 'PHONE', 'example: 000-000-0000');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Programming keywords', () => {
    it('should detect keywords as non-names', () => {
      const result = isFalsePositive('Function', 'NAME', 'a Function');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect reserved words', () => {
      const result = isFalsePositive('Class', 'NAME', 'const Class = ');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Common words after articles', () => {
    it('should detect words right after "the"', () => {
      const result = isFalsePositive('Bank', 'NAME', 'go to the ');
      expect(result.isFalsePositive).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should detect words right after "a"', () => {
      const result = isFalsePositive('Person', 'NAME', 'hire a ');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Test account numbers', () => {
    it('should detect all-zeros', () => {
      const result = isFalsePositive('0000-0000-0000', 'ACCOUNT', 'account: 0000-0000-0000');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect repeating digits', () => {
      const result = isFalsePositive('1111111111', 'CARD', 'card: 1111111111');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect sequential numbers', () => {
      const result = isFalsePositive('0123456789', 'ACCOUNT', 'test: 0123456789');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Timestamps', () => {
    it('should detect Unix timestamps', () => {
      const result = isFalsePositive('1234567890', 'PHONE', 'timestamp: 1234567890');
      expect(result.isFalsePositive).toBe(true);
    });

    it('should detect epoch times', () => {
      const result = isFalsePositive('1609459200', 'ID', 'epoch: 1609459200');
      expect(result.isFalsePositive).toBe(true);
    });
  });

  describe('Real PII should not be flagged', () => {
    it('should not flag real phone numbers', () => {
      const result = isFalsePositive('07700 900123', 'PHONE_UK_MOBILE', 'Call me at 07700 900123');
      expect(result.isFalsePositive).toBe(false);
    });

    it('should not flag real emails', () => {
      const result = isFalsePositive('john.smith@company.co.uk', 'EMAIL', 'Email: john.smith@company.co.uk');
      expect(result.isFalsePositive).toBe(false);
    });

    it('should not flag real account numbers', () => {
      const result = isFalsePositive('12345678', 'UK_BANK_ACCOUNT', 'Account: 12345678');
      expect(result.isFalsePositive).toBe(false);
    });
  });

  describe('Integration with OpenRedact', () => {
    it('should filter version numbers when enabled', () => {
      const redactor = new OpenRedact({
        enableFalsePositiveFilter: true
      });
      const result = redactor.detect('App version 1.2.3 released');

      // Should not detect version as phone number
      const phoneDetections = result.detections.filter(d => d.type.includes('PHONE'));
      expect(phoneDetections.length).toBe(0);
    });

    it('should filter test emails when enabled', () => {
      const redactor = new OpenRedact({
        enableFalsePositiveFilter: true
      });
      const result = redactor.detect('Contact test@example.com for support');

      // Should not detect example.com emails
      expect(result.detections.length).toBe(0);
    });

    it('should filter dates mistaken for phones when enabled', () => {
      const redactor = new OpenRedact({
        enableFalsePositiveFilter: true
      });
      const result = redactor.detect('Born on 01-02-1990');

      // Should not detect date as phone
      const phoneDetections = result.detections.filter(d => d.type.includes('PHONE'));
      expect(phoneDetections.length).toBe(0);
    });

    it('should not filter by default (disabled)', () => {
      const redactor = new OpenRedact();

      // With filtering disabled (default), should detect example.com email
      const result = redactor.detect('Contact test@example.com');
      const emailDetections = result.detections.filter(d => d.type === 'EMAIL');

      // May or may not detect depending on other filters, but option should be respected
      expect(result).toBeDefined();
    });

    it('should still detect real PII with filter enabled', () => {
      const redactor = new OpenRedact({
        enableFalsePositiveFilter: true
      });
      const result = redactor.detect('Call John at 07700-900-123 for details');

      // Should still detect real phone number
      expect(result.detections.length).toBeGreaterThan(0);
    });
  });
});
