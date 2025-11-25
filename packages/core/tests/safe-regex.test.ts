import { describe, it, expect } from 'vitest';
import {
  safeExec,
  safeExecAll,
  isUnsafePattern,
  validatePattern,
  RegexTimeoutError
} from '../src/utils/safe-regex';

describe('Safe Regex Utilities', () => {
  describe('isUnsafePattern', () => {
    it('should detect nested quantifiers', () => {
      expect(isUnsafePattern('(a+)+')).toBe(true);
      expect(isUnsafePattern('(a*)*')).toBe(true);
      expect(isUnsafePattern('(a{1,}){1,}')).toBe(true);
    });

    it('should detect overlapping alternation', () => {
      expect(isUnsafePattern('(a|a)+')).toBe(true);
      expect(isUnsafePattern('(ab|a)+')).toBe(true);
    });

    it('should detect consecutive quantifiers', () => {
      expect(isUnsafePattern('a*+')).toBe(true);
      expect(isUnsafePattern('a+*')).toBe(true);
    });

    it('should detect dangerous backreferences', () => {
      expect(isUnsafePattern('\\1+')).toBe(true);
      expect(isUnsafePattern('\\2*')).toBe(true);
    });

    it('should allow safe patterns', () => {
      expect(isUnsafePattern('^[a-z]+$')).toBe(false);
      expect(isUnsafePattern('\\d{3}-\\d{2}-\\d{4}')).toBe(false);
      expect(isUnsafePattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')).toBe(false);
    });
  });

  describe('validatePattern', () => {
    it('should validate safe patterns', () => {
      expect(() => validatePattern('^test$')).not.toThrow();
      expect(() => validatePattern('\\d+')).not.toThrow();
      expect(() => validatePattern('[a-z]{3,10}')).not.toThrow();
    });

    it('should reject patterns that are too long', () => {
      const longPattern = 'a'.repeat(5001);
      expect(() => validatePattern(longPattern)).toThrow('too long');
    });

    it('should reject unsafe patterns', () => {
      expect(() => validatePattern('(a+)+')).toThrow('unsafe');
      expect(() => validatePattern('(a*)*')).toThrow('unsafe');
    });

    it('should reject invalid patterns', () => {
      expect(() => validatePattern('(unclosed')).toThrow();
      expect(() => validatePattern('[invalid')).toThrow();
    });
  });

  describe('safeExec', () => {
    it('should execute safe regex normally', () => {
      const regex = /\d+/g;
      const result = safeExec(regex, 'test 123 abc', { timeout: 100 });
      expect(result).not.toBeNull();
      expect(result![0]).toBe('123');
    });

    it('should return null when no match', () => {
      const regex = /xyz/g;
      const result = safeExec(regex, 'abc', { timeout: 100 });
      expect(result).toBeNull();
    });

    it('should handle complex patterns', () => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const result = safeExec(regex, 'test@example.com', { timeout: 100 });
      expect(result).not.toBeNull();
      expect(result![0]).toBe('test@example.com');
    });

    // Note: Timeout testing is difficult in unit tests as it depends on actual execution time
    // In real scenarios, catastrophic backtracking would trigger the timeout
  });

  describe('safeExecAll', () => {
    it('should find all matches with global flag', () => {
      const regex = /\d+/g;
      const matches = safeExecAll(regex, 'a1b2c3', { timeout: 100 });
      expect(matches).toHaveLength(3);
      expect(matches[0][0]).toBe('1');
      expect(matches[1][0]).toBe('2');
      expect(matches[2][0]).toBe('3');
    });

    it('should find single match without global flag', () => {
      const regex = /\d+/;
      const matches = safeExecAll(regex, 'a1b2c3', { timeout: 100 });
      expect(matches).toHaveLength(1);
      expect(matches[0][0]).toBe('1');
    });

    it('should return empty array when no matches', () => {
      const regex = /xyz/g;
      const matches = safeExecAll(regex, 'abc', { timeout: 100 });
      expect(matches).toHaveLength(0);
    });

    it('should enforce max matches limit', () => {
      const regex = /./g;
      expect(() => {
        safeExecAll(regex, 'a'.repeat(20000), { timeout: 1000, maxMatches: 100 });
      }).toThrow('exceeded max matches');
    });

    it('should handle zero-length matches', () => {
      const regex = /a*/g;
      const matches = safeExecAll(regex, 'aabaa', { timeout: 100, maxMatches: 100 });
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.length).toBeLessThan(100); // Should not infinite loop
    });
  });

  describe('Integration with detector', () => {
    it('should validate email pattern', () => {
      const emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
      expect(() => validatePattern(emailPattern)).not.toThrow();
      expect(isUnsafePattern(emailPattern)).toBe(false);
    });

    it('should validate SSN pattern', () => {
      const ssnPattern = '\\b\\d{3}-\\d{2}-\\d{4}\\b';
      expect(() => validatePattern(ssnPattern)).not.toThrow();
      expect(isUnsafePattern(ssnPattern)).toBe(false);
    });

    it('should validate credit card pattern', () => {
      const ccPattern = '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b';
      expect(() => validatePattern(ccPattern)).not.toThrow();
      expect(isUnsafePattern(ccPattern)).toBe(false);
    });
  });
});
