import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Pattern Detection', () => {
  describe('Personal patterns', () => {
    it('should detect email addresses', () => {
      const shield = new OpenRedaction({ patterns: ['EMAIL'] });

      const tests = [
        'john@example.com',
        'user.name@example.co.uk',
        'test+tag@domain.com'
      ];

      tests.forEach(email => {
        const result = shield.detect(`Contact: ${email}`);
        expect(result.detections.some(d => d.value === email)).toBe(true);
      });
    });

    it('should detect names', () => {
      const shield = new OpenRedaction({ patterns: ['NAME'] });

      const result = shield.detect('Contact John Smith for details');
      expect(result.detections.some(d => d.type === 'NAME')).toBe(true);
    });

    it('should detect employee IDs', () => {
      const shield = new OpenRedaction({ patterns: ['EMPLOYEE_ID'] });

      const tests = [
        'EMP-12345',
        'Employee ID: ABC123',
        'EMPL_NUM: XYZ789'
      ];

      tests.forEach(text => {
        const result = shield.detect(text);
        expect(result.detections.some(d => d.type === 'EMPLOYEE_ID')).toBe(true);
      });
    });
  });

  describe('Financial patterns', () => {
    it('should detect credit cards with Luhn validation', () => {
      const shield = new OpenRedaction({ patterns: ['CREDIT_CARD'] });

      // Valid cards
      const validCards = [
        '4532015112830366',
        '5425233430109903',
        '374245455400126'
      ];

      validCards.forEach(card => {
        const result = shield.detect(`Card: ${card}`);
        expect(result.detections.some(d => d.type === 'CREDIT_CARD')).toBe(true);
      });

      // Invalid card (fails Luhn check)
      const invalid = shield.detect('Card: 1234567890123456');
      expect(invalid.detections.some(d => d.type === 'CREDIT_CARD')).toBe(false);
    });

    it('should detect IBAN', () => {
      const shield = new OpenRedaction({ patterns: ['IBAN'] });

      const result = shield.detect('Account: GB82WEST12345698765432');
      expect(result.detections.some(d => d.type === 'IBAN')).toBe(true);
    });

    it('should detect UK bank accounts', () => {
      const shield = new OpenRedaction({ patterns: ['BANK_ACCOUNT_UK'] });

      const result = shield.detect('Account: 12345678');
      expect(result.detections.some(d => d.type === 'BANK_ACCOUNT_UK')).toBe(true);
    });

    it('should detect UK sort codes', () => {
      const shield = new OpenRedaction({ patterns: ['SORT_CODE_UK'] });

      const tests = [
        'Sort code: 12-34-56',
        'SC: 123456'
      ];

      tests.forEach(text => {
        const result = shield.detect(text);
        expect(result.detections.some(d => d.type === 'SORT_CODE_UK')).toBe(true);
      });
    });
  });

  describe('Government patterns', () => {
    it('should detect US SSN', () => {
      const shield = new OpenRedaction({ patterns: ['SSN'] });

      const tests = [
        'SSN: 123-45-6789',
        'Social security: 123 45 6789'
      ];

      tests.forEach(text => {
        const result = shield.detect(text);
        expect(result.detections.some(d => d.type === 'SSN')).toBe(true);
      });
    });

    it('should detect UK National Insurance', () => {
      const shield = new OpenRedaction({ patterns: ['NATIONAL_INSURANCE_UK'] });

      const result = shield.detect('NINO: AB123456C');
      expect(result.detections.some(d => d.type === 'NATIONAL_INSURANCE_UK')).toBe(true);
    });

    it('should detect NHS numbers', () => {
      const shield = new OpenRedaction({ patterns: ['NHS_NUMBER'] });

      const result = shield.detect('NHS: 4505577104');
      expect(result.detections.some(d => d.type === 'NHS_NUMBER')).toBe(true);
    });

    it('should detect UK passports', () => {
      const shield = new OpenRedaction({ patterns: ['PASSPORT_UK'] });

      const result = shield.detect('Passport: 123456789');
      expect(result.detections.some(d => d.type === 'PASSPORT_UK')).toBe(true);
    });

    it('should detect UK driving licenses', () => {
      const shield = new OpenRedaction({ patterns: ['DRIVING_LICENSE_UK'] });

      const result = shield.detect('License: SMITH901234AB1CD');
      expect(result.detections.some(d => d.type === 'DRIVING_LICENSE_UK')).toBe(true);
    });
  });

  describe('Contact patterns', () => {
    it('should detect UK mobile phones', () => {
      const shield = new OpenRedaction({ patterns: ['PHONE_UK_MOBILE'] });

      const tests = [
        '07700900123',
        '07700 900 123'
      ];

      tests.forEach(phone => {
        const result = shield.detect(`Call: ${phone}`);
        expect(result.detections.some(d => d.type === 'PHONE_UK_MOBILE')).toBe(true);
      });
    });

    it('should detect US phones', () => {
      const shield = new OpenRedaction({ patterns: ['PHONE_US'] });

      const tests = [
        '(555) 123-4567',
        '555-123-4567',
        '+1-555-123-4567'
      ];

      tests.forEach(phone => {
        const result = shield.detect(`Call: ${phone}`);
        expect(result.detections.some(d => d.type === 'PHONE_US')).toBe(true);
      });
    });

    it('should detect UK postcodes', () => {
      const shield = new OpenRedaction({ patterns: ['POSTCODE_UK'] });

      const tests = [
        'SW1A 1AA',
        'M1 1AE',
        'B33 8TH'
      ];

      tests.forEach(postcode => {
        const result = shield.detect(`Address: ${postcode}`);
        expect(result.detections.some(d => d.type === 'POSTCODE_UK')).toBe(true);
      });
    });

    it('should detect US ZIP codes', () => {
      const shield = new OpenRedaction({ patterns: ['ZIP_CODE_US'] });

      const tests = [
        '12345',
        '12345-6789'
      ];

      tests.forEach(zip => {
        const result = shield.detect(`ZIP: ${zip}`);
        expect(result.detections.some(d => d.type === 'ZIP_CODE_US')).toBe(true);
      });
    });

    it('should detect street addresses', () => {
      const shield = new OpenRedaction({ patterns: ['ADDRESS_STREET'] });

      const tests = [
        '123 Main Street',
        '456 Oak Avenue',
        '789 Park Drive'
      ];

      tests.forEach(address => {
        const result = shield.detect(`Address: ${address}`);
        expect(result.detections.some(d => d.type === 'ADDRESS_STREET')).toBe(true);
      });
    });
  });

  describe('Network patterns', () => {
    it('should detect IPv4 addresses', () => {
      const shield = new OpenRedaction({ patterns: ['IPV4'] });

      const result = shield.detect('Server: 203.0.113.42');
      expect(result.detections.some(d => d.type === 'IPV4')).toBe(true);
    });

    it('should not detect private IPv4 addresses', () => {
      const shield = new OpenRedaction({ patterns: ['IPV4'] });

      const privateIPs = [
        '192.168.1.1',
        '10.0.0.1',
        '127.0.0.1'
      ];

      privateIPs.forEach(ip => {
        const result = shield.detect(`Server: ${ip}`);
        expect(result.detections.some(d => d.type === 'IPV4')).toBe(false);
      });
    });

    it('should detect IPv6 addresses', () => {
      const shield = new OpenRedaction({ patterns: ['IPV6'] });

      const result = shield.detect('Server: 2001:0db8:85a3:0000:0000:8a2e:0370:7334');
      expect(result.detections.some(d => d.type === 'IPV6')).toBe(true);
    });

    it('should detect MAC addresses', () => {
      const shield = new OpenRedaction({ patterns: ['MAC_ADDRESS'] });

      const tests = [
        '00:1B:44:11:3A:B7',
        '00-1B-44-11-3A-B7'
      ];

      tests.forEach(mac => {
        const result = shield.detect(`Device: ${mac}`);
        expect(result.detections.some(d => d.type === 'MAC_ADDRESS')).toBe(true);
      });
    });

    it('should detect URLs with credentials', () => {
      const shield = new OpenRedaction({ patterns: ['URL_WITH_AUTH'] });

      const result = shield.detect('Connect: https://user:pass@example.com/path');
      expect(result.detections.some(d => d.type === 'URL_WITH_AUTH')).toBe(true);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle mixed PII in email text', () => {
      const shield = new OpenRedaction();
      const text = `
        Hi John Smith,

        Please contact me at john@example.com or call 07700900123.
        My SSN is 123-45-6789 for verification.

        Thanks!
      `;

      const result = shield.detect(text);
      expect(result.detections.length).toBeGreaterThan(0);
      expect(result.detections.some(d => d.type === 'EMAIL')).toBe(true);
    });

    it('should handle financial document', () => {
      const shield = new OpenRedaction();
      const text = `
        Card Number: 4532015112830366
        Sort Code: 12-34-56
        Account: 12345678
        IBAN: GB82WEST12345698765432
      `;

      const result = shield.detect(text);
      expect(result.detections.some(d => d.type === 'CREDIT_CARD')).toBe(true);
      expect(result.detections.some(d => d.type === 'SORT_CODE_UK')).toBe(true);
      expect(result.detections.some(d => d.type === 'IBAN')).toBe(true);
    });

    it('should handle government form', () => {
      const shield = new OpenRedaction();
      const text = `
        Name: John Smith
        SSN: 123-45-6789
        Driver's License: SMITH901234AB1CD
        Date of Birth: 01/01/1980
      `;

      const result = shield.detect(text);
      expect(result.detections.length).toBeGreaterThan(0);
    });
  });
});
