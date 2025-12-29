/**
 * Test infrastructure for pattern hardening
 * Provides test fixtures and utilities for validating hardened patterns
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';
import {
  normalizeSeparators,
  validateChecksum,
  enhanceValidator,
  withSeparatorTolerance,
  isFalsePositive
} from '../src/utils/pattern-hardening';

describe('Pattern Hardening Utilities', () => {
  describe('normalizeSeparators', () => {
    it('should remove dashes', () => {
      expect(normalizeSeparators('123-456-7890')).toBe('1234567890');
    });

    it('should remove spaces', () => {
      expect(normalizeSeparators('123 456 7890')).toBe('1234567890');
    });

    it('should remove dots', () => {
      expect(normalizeSeparators('123.456.7890')).toBe('1234567890');
    });

    it('should remove non-breaking spaces', () => {
      expect(normalizeSeparators('123\u00A0456\u00A07890')).toBe('1234567890');
    });

    it('should remove slashes', () => {
      expect(normalizeSeparators('123/456/7890')).toBe('1234567890');
    });

    it('should handle mixed separators', () => {
      expect(normalizeSeparators('123-456.7890 123')).toBe('1234567890123');
    });

    it('should preserve format when requested', () => {
      const result = normalizeSeparators('123-456.7890', true);
      expect(result).toMatch(/123.*456.*7890/);
    });
  });

  describe('validateChecksum', () => {
    describe('Luhn algorithm', () => {
      it('should validate correct credit card numbers', () => {
        expect(validateChecksum('4532015112830366', 'luhn')).toBe(true);
        expect(validateChecksum('5425233430109903', 'luhn')).toBe(true);
      });

      it('should validate with separators', () => {
        expect(validateChecksum('4532-0151-1283-0366', 'luhn')).toBe(true);
        expect(validateChecksum('4532 0151 1283 0366', 'luhn')).toBe(true);
      });

      it('should reject invalid checksums', () => {
        expect(validateChecksum('4532015112830367', 'luhn')).toBe(false);
        expect(validateChecksum('1234567890123456', 'luhn')).toBe(false);
      });
    });

    describe('MOD-97 algorithm', () => {
      it('should validate correct IBANs', () => {
        // GB82 WEST 1234 5698 7654 32 is a valid IBAN format
        expect(validateChecksum('GB82WEST12345698765432', 'mod97')).toBe(true);
        // DE89 3704 0044 0532 0130 00 is a valid IBAN
        expect(validateChecksum('DE89370400440532013000', 'mod97')).toBe(true);
      });

      it('should validate with spaces', () => {
        expect(validateChecksum('GB82 WEST 1234 5698 7654 32', 'mod97')).toBe(true);
      });

      it('should reject invalid IBANs', () => {
        // Invalid check digits
        expect(validateChecksum('GB83WEST12345698765432', 'mod97')).toBe(false);
      });
    });

    describe('MOD-11 algorithm', () => {
      it('should validate with custom weights', () => {
        // Create a valid MOD-11 number with custom weights
        // For 8 data digits with weights [9,8,7,6,5,4,3,2], calculate check digit
        // Digits: 1,2,3,4,5,6,7,8
        // Sum = 1*9 + 2*8 + 3*7 + 4*6 + 5*5 + 6*4 + 7*3 + 8*2 = 9+16+21+24+25+24+21+16 = 156
        // 156 % 11 = 2, check digit = 11 - 2 = 9
        // So valid number is 123456789
        const value = '123456789';
        const weights = [9, 8, 7, 6, 5, 4, 3, 2]; // 8 weights for 8 data digits
        expect(validateChecksum(value, 'mod11', { weights })).toBe(true);
      });

      it('should reject invalid MOD-11 numbers', () => {
        const value = '123456788'; // Wrong check digit
        const weights = [9, 8, 7, 6, 5, 4, 3, 2];
        expect(validateChecksum(value, 'mod11', { weights })).toBe(false);
      });
    });

    describe('MOD-10 algorithm', () => {
      it('should validate with default weights', () => {
        // Luhn algorithm is MOD-10 with alternating weights
        // Using a known valid Luhn number
        const value = '4532015112830366'; // Valid credit card (Luhn)
        expect(validateChecksum(value, 'mod10')).toBe(true);
      });
    });

    describe('Custom algorithm', () => {
      it('should use custom validation function', () => {
        const customFn = (value: string) => value.length === 10;
        expect(validateChecksum('1234567890', 'custom', { customFn })).toBe(true);
        expect(validateChecksum('12345', 'custom', { customFn })).toBe(false);
      });
    });
  });

  describe('enhanceValidator', () => {
    it('should normalize separators before validation', () => {
      const baseValidator = (value: string) => value.length === 10;
      const enhanced = enhanceValidator(baseValidator, { normalizeSeparators: true });
      
      expect(enhanced('123-456-7890', '')).toBe(true);
      expect(enhanced('123 456 7890', '')).toBe(true);
      expect(enhanced('1234567890', '')).toBe(true);
    });

    it('should enforce minimum length', () => {
      const baseValidator = (value: string) => true;
      const enhanced = enhanceValidator(baseValidator, { minLength: 10 });
      
      expect(enhanced('1234567890', '')).toBe(true);
      expect(enhanced('12345', '')).toBe(false);
    });

    it('should enforce maximum length', () => {
      const baseValidator = (value: string) => true;
      const enhanced = enhanceValidator(baseValidator, { maxLength: 10 });
      
      expect(enhanced('1234567890', '')).toBe(true);
      expect(enhanced('123456789012345', '')).toBe(false);
    });

    it('should validate pattern', () => {
      const baseValidator = (value: string) => true;
      const enhanced = enhanceValidator(baseValidator, { pattern: /^\d{10}$/ });
      
      expect(enhanced('1234567890', '')).toBe(true);
      expect(enhanced('abc1234567', '')).toBe(false);
    });

    it('should check context keywords', () => {
      const baseValidator = (value: string) => true;
      const enhanced = enhanceValidator(baseValidator, {
        contextKeywords: ['account', 'customer']
      });
      
      expect(enhanced('1234567890', 'Account number: 1234567890')).toBe(true);
      expect(enhanced('1234567890', 'Random text')).toBe(false);
    });

    it('should reject keywords in context', () => {
      const baseValidator = (value: string) => true;
      const enhanced = enhanceValidator(baseValidator, {
        rejectKeywords: ['example', 'test']
      });
      
      expect(enhanced('1234567890', 'Example value')).toBe(false);
      expect(enhanced('1234567890', 'Real account number')).toBe(true);
    });
  });

  describe('withSeparatorTolerance', () => {
    it('should create validator that handles separators', () => {
      const baseValidator = (value: string) => value.length === 10;
      const tolerant = withSeparatorTolerance(baseValidator);
      
      expect(tolerant('123-456-7890', '')).toBe(true);
      expect(tolerant('123 456 7890', '')).toBe(true);
      expect(tolerant('123.456.7890', '')).toBe(true);
      expect(tolerant('1234567890', '')).toBe(true);
    });
  });

  describe('isFalsePositive', () => {
    it('should detect version numbers', () => {
      expect(isFalsePositive('1234567890', 'version 1.2.3')).toBe(true);
      expect(isFalsePositive('1234567890', 'v2.0.0')).toBe(true);
    });

    it('should detect dates', () => {
      // Dates in format DD-MM-YYYY or MM-DD-YYYY
      expect(isFalsePositive('12-34-5678', 'Date: 12-34-5678')).toBe(true);
      expect(isFalsePositive('12/34/5678', 'Date: 12/34/5678')).toBe(true);
      // But not phone numbers
      expect(isFalsePositive('12-34-5678', 'Phone: 12-34-5678')).toBe(false);
    });

    it('should detect all zeros', () => {
      expect(isFalsePositive('0000000000', '')).toBe(true);
    });

    it('should detect repeating digits', () => {
      expect(isFalsePositive('1111111111', '')).toBe(true);
      expect(isFalsePositive('2222222222', '')).toBe(true);
    });

    it('should detect sequential numbers', () => {
      expect(isFalsePositive('123456', '')).toBe(true);
      expect(isFalsePositive('987654', '')).toBe(true);
    });

    it('should detect test keywords', () => {
      expect(isFalsePositive('1234567890', 'test value')).toBe(true);
      expect(isFalsePositive('1234567890', 'example data')).toBe(true);
      expect(isFalsePositive('1234567890', 'sample text')).toBe(true);
    });

    it('should not flag valid values', () => {
      expect(isFalsePositive('1234567890', 'Account number: 1234567890')).toBe(false);
      expect(isFalsePositive('5551234567', 'Phone: 555-123-4567')).toBe(false);
    });
  });
});

/**
 * Test fixture structure for hardened patterns
 * Use this as a template for testing individual hardened patterns
 */
export interface HardenedPatternTestFixture {
  patternType: string;
  positiveCases: Array<{
    input: string;
    context?: string;
    description: string;
  }>;
  negativeCases: Array<{
    input: string;
    context?: string;
    description: string;
  }>;
  separatorVariations: Array<{
    input: string;
    expected: boolean;
    description: string;
  }>;
}

/**
 * Helper function to test a hardened pattern
 */
export async function testHardenedPattern(
  patternType: string,
  fixture: HardenedPatternTestFixture
): Promise<void> {
  const detector = new OpenRedaction({ patterns: [patternType] });

  describe(`Hardened Pattern: ${patternType}`, () => {
    describe('Positive cases', () => {
      for (const testCase of fixture.positiveCases) {
        it(`should detect: ${testCase.description}`, async () => {
          const result = await detector.detect(testCase.input);
          expect(result.detections.some(d => d.type === patternType)).toBe(true);
        });
      }
    });

    describe('Negative cases', () => {
      for (const testCase of fixture.negativeCases) {
        it(`should reject: ${testCase.description}`, async () => {
          const result = await detector.detect(testCase.input);
          expect(result.detections.some(d => d.type === patternType)).toBe(false);
        });
      }
    });

    describe('Separator variations', () => {
      for (const variation of fixture.separatorVariations) {
        it(`should handle: ${variation.description}`, async () => {
          const result = await detector.detect(variation.input);
          const detected = result.detections.some(d => d.type === patternType);
          expect(detected).toBe(variation.expected);
        });
      }
    });
  });
}

/**
 * Example test fixture for POSTCODE_UK
 */
export const POSTCODE_UK_FIXTURE: HardenedPatternTestFixture = {
  patternType: 'POSTCODE_UK',
  positiveCases: [
    { input: 'SW1A 1AA', description: 'Standard format' },
    { input: 'M1 1AA', description: 'Short format' },
    { input: 'EC1A 1BB', description: 'London format' }
  ],
  negativeCases: [
    { input: '12345', description: 'US ZIP code' },
    { input: 'INVALID', description: 'Invalid format' }
  ],
  separatorVariations: [
    { input: 'SW1A 1AA', expected: true, description: 'with space' },
    { input: 'SW1A-1AA', expected: true, description: 'with dash' },
    { input: 'SW1A1AA', expected: true, description: 'without separator' }
  ]
};

/**
 * Example test fixture for ZIP_CODE_US
 */
export const ZIP_CODE_US_FIXTURE: HardenedPatternTestFixture = {
  patternType: 'ZIP_CODE_US',
  positiveCases: [
    { input: '12345', description: '5-digit ZIP' },
    { input: '12345-6789', description: 'ZIP+4 format' }
  ],
  negativeCases: [
    { input: '1234', description: 'Too short' },
    { input: '123456', description: 'Too long (without dash)' }
  ],
  separatorVariations: [
    { input: '12345', expected: true, description: '5 digits' },
    { input: '12345-6789', expected: true, description: 'with dash' },
    { input: '12345 6789', expected: true, description: 'with space' }
  ]
};

