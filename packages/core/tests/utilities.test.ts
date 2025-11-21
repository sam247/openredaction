import { describe, it, expect } from 'vitest';
import { getPatternsByCategory, allPatterns } from '../src/patterns';
import { getPreset } from '../src/utils/presets';

describe('Pattern utilities', () => {
  describe('getPatternsByCategory', () => {
    it('should return personal patterns', () => {
      const patterns = getPatternsByCategory('personal');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some(p => p.type === 'EMAIL')).toBe(true);
    });

    it('should return financial patterns', () => {
      const patterns = getPatternsByCategory('financial');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some(p => p.type === 'CREDIT_CARD')).toBe(true);
    });

    it('should return government patterns', () => {
      const patterns = getPatternsByCategory('government');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some(p => p.type === 'SSN')).toBe(true);
    });

    it('should return contact patterns', () => {
      const patterns = getPatternsByCategory('contact');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some(p => p.type === 'PHONE_UK_MOBILE')).toBe(true);
    });

    it('should return network patterns', () => {
      const patterns = getPatternsByCategory('network');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some(p => p.type === 'IPV4')).toBe(true);
    });

    it('should return empty array for unknown category', () => {
      const patterns = getPatternsByCategory('unknown');
      expect(patterns).toEqual([]);
    });
  });

  describe('allPatterns', () => {
    it('should include all pattern types', () => {
      expect(allPatterns.length).toBeGreaterThan(20);
      expect(allPatterns.every(p => p.type && p.regex && p.priority)).toBe(true);
    });
  });
});

describe('Preset utilities', () => {
  describe('getPreset', () => {
    it('should return GDPR preset', () => {
      const preset = getPreset('gdpr');
      expect(preset.patterns).toBeDefined();
      expect(preset.patterns).toContain('EMAIL');
    });

    it('should return HIPAA preset', () => {
      const preset = getPreset('hipaa');
      expect(preset.patterns).toBeDefined();
      expect(preset.patterns).toContain('SSN');
    });

    it('should return CCPA preset', () => {
      const preset = getPreset('ccpa');
      expect(preset.patterns).toBeDefined();
      expect(preset.patterns).toContain('EMAIL');
    });

    it('should return empty object for unknown preset', () => {
      const preset = getPreset('unknown');
      expect(preset).toEqual({});
    });
  });
});
