import { describe, it, expect } from 'vitest';
import {
  validateLuhn,
  validateIBAN,
  validateNINO,
  validateNHS,
  validateSSN,
  validateSortCode,
  validateEmail,
  validateName
} from '../src/validators';

describe('Validators', () => {
  describe('validateLuhn', () => {
    it('should validate correct credit card numbers', () => {
      expect(validateLuhn('4532015112830366')).toBe(true); // Visa
      expect(validateLuhn('5425233430109903')).toBe(true); // Mastercard
      expect(validateLuhn('374245455400126')).toBe(true); // Amex
    });

    it('should validate credit cards with spaces', () => {
      expect(validateLuhn('4532 0151 1283 0366')).toBe(true);
    });

    it('should validate credit cards with hyphens', () => {
      expect(validateLuhn('4532-0151-1283-0366')).toBe(true);
    });

    it('should reject invalid credit card numbers', () => {
      expect(validateLuhn('1234567890123456')).toBe(false);
      expect(validateLuhn('4532015112830367')).toBe(false); // Wrong check digit
    });

    it('should reject non-numeric input', () => {
      expect(validateLuhn('abcd-efgh-ijkl-mnop')).toBe(false);
    });

    it('should reject too short numbers', () => {
      expect(validateLuhn('123456789012')).toBe(false);
    });
  });

  describe('validateIBAN', () => {
    it('should validate correct IBANs', () => {
      expect(validateIBAN('GB82 WEST 1234 5698 7654 32')).toBe(true);
      expect(validateIBAN('DE89370400440532013000')).toBe(true);
      expect(validateIBAN('FR1420041010050500013M02606')).toBe(true);
    });

    it('should reject invalid IBANs', () => {
      expect(validateIBAN('GB82 WEST 1234 5698 7654 33')).toBe(false); // Wrong checksum
      expect(validateIBAN('XX82WEST12345698765432')).toBe(false); // Invalid country
    });

    it('should reject incorrect length IBANs', () => {
      expect(validateIBAN('GB82WEST123456987654')).toBe(false); // Too short for GB
    });
  });

  describe('validateNINO', () => {
    it('should validate correct NINOs', () => {
      expect(validateNINO('AB123456C')).toBe(true);
      expect(validateNINO('JK 12 34 56 D')).toBe(true);
    });

    it('should reject invalid prefixes', () => {
      expect(validateNINO('BG123456C')).toBe(false);
      expect(validateNINO('GB123456C')).toBe(false);
      expect(validateNINO('NK123456C')).toBe(false);
    });

    it('should reject invalid formats', () => {
      expect(validateNINO('A1123456C')).toBe(false); // Single letter prefix
      expect(validateNINO('AB123456E')).toBe(false); // Invalid suffix
    });
  });

  describe('validateNHS', () => {
    it('should validate correct NHS numbers', () => {
      expect(validateNHS('4505577104')).toBe(true);
      expect(validateNHS('450 557 7104')).toBe(true);
    });

    it('should reject invalid NHS numbers', () => {
      expect(validateNHS('4505577105')).toBe(false); // Wrong check digit
      expect(validateNHS('1234567890')).toBe(false);
    });

    it('should reject incorrect format', () => {
      expect(validateNHS('123456789')).toBe(false); // Too short
      expect(validateNHS('12345678901')).toBe(false); // Too long
    });
  });

  describe('validateSSN', () => {
    it('should validate correct SSNs', () => {
      expect(validateSSN('123-45-6789')).toBe(true);
      expect(validateSSN('123 45 6789')).toBe(true);
      expect(validateSSN('123456789')).toBe(true);
    });

    it('should reject invalid area codes', () => {
      expect(validateSSN('000-45-6789')).toBe(false);
      expect(validateSSN('666-45-6789')).toBe(false);
      expect(validateSSN('900-45-6789')).toBe(false);
    });

    it('should reject zeros in group or serial', () => {
      expect(validateSSN('123-00-6789')).toBe(false);
      expect(validateSSN('123-45-0000')).toBe(false);
    });

    it('should reject known test SSNs', () => {
      expect(validateSSN('123-45-6789')).toBe(true); // This is actually valid
      expect(validateSSN('111-11-1111')).toBe(false);
    });
  });

  describe('validateSortCode', () => {
    it('should validate correct sort codes', () => {
      expect(validateSortCode('12-34-56')).toBe(true);
      expect(validateSortCode('12 34 56')).toBe(true);
      expect(validateSortCode('123456')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(validateSortCode('12-34')).toBe(false);
      expect(validateSortCode('1234567')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(validateEmail('test_email@test-domain.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@domain')).toBe(false); // No TLD
    });
  });

  describe('validateName', () => {
    it('should validate real names', () => {
      expect(validateName('John Smith', 'Contact John Smith for details')).toBe(true);
      expect(validateName('Mary Jane', 'Mary Jane will attend')).toBe(true);
    });

    it('should reject business terms', () => {
      expect(validateName('Company Limited', 'Contact Company Limited')).toBe(false);
      expect(validateName('Monday', 'Meeting on Monday')).toBe(false);
      expect(validateName('January', 'Starting in January')).toBe(false);
    });

    it('should reject single letters', () => {
      expect(validateName('A', 'Point A to B')).toBe(false);
    });

    it('should reject short acronyms', () => {
      expect(validateName('ABC', 'The ABC company')).toBe(false);
    });

    it('should reject business context', () => {
      expect(validateName('Smith Corp', 'Company Smith Corp')).toBe(false);
    });
  });
});
