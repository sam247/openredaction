import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Pattern Category Filtering', () => {
  it('should load only personal category patterns', async () => {
    const shield = new OpenRedaction({
      categories: ['personal'],
      debug: true
    });

    const patterns = shield.getPatterns();
    const patternTypes = patterns.map(p => p.type);

    // Should have personal patterns (EMAIL, NAME, etc.)
    expect(patternTypes.some(t => t.includes('EMAIL'))).toBe(true);

    // Should NOT have industry-specific patterns
    expect(patternTypes.some(t => t.includes('HIPAA'))).toBe(false);
    expect(patternTypes.some(t => t.includes('AVIATION'))).toBe(false);

    // Verify significantly fewer patterns than all 571
    expect(patterns.length).toBeLessThan(100);
  });

  it('should load only financial category patterns', async () => {
    const shield = new OpenRedaction({
      categories: ['financial']
    });
    const patterns = shield.getPatterns();
    const patternTypes = patterns.map(p => p.type);

    // Should have financial patterns
    expect(patternTypes.some(t => t.includes('CREDIT_CARD') || t.includes('IBAN'))).toBe(true);

    // Verify fewer patterns
    expect(patterns.length).toBeLessThan(150);
  });

  it('should load multiple categories', async () => {
    const shield = new OpenRedaction({
      categories: ['personal', 'contact', 'network']
    });
    const patterns = shield.getPatterns();
    const patternTypes = patterns.map(p => p.type);

    // Should have patterns from all three categories
    expect(patternTypes.some(t => t.includes('EMAIL'))).toBe(true); // personal/contact
    expect(patternTypes.some(t => t.includes('PHONE'))).toBe(true); // contact
    expect(patternTypes.some(t => t.includes('IP'))).toBe(true); // network

    console.log(`Loaded ${patterns.length} patterns from 3 categories`);
  });

  it('should improve performance by using fewer patterns', async () => {
    const text = 'Email: john@example.com, IP: 192.168.1.1';

    // All patterns
    const shieldAll = new OpenRedaction();
    const startAll = performance.now();
    const resultAll = await shieldAll.detect(text);
    const timeAll = performance.now() - startAll;

    // Only personal and network categories
    const shieldFiltered = new OpenRedaction({
      categories: ['personal', 'network']
    });
    const startFiltered = performance.now();
    const resultFiltered = await shieldFiltered.detect(text);
    const timeFiltered = performance.now() - startFiltered;

    // Both should find the same detections
    expect(resultFiltered.detections.length).toBe(resultAll.detections.length);

    // Filtered should have fewer patterns
    expect(shieldFiltered.getPatterns().length).toBeLessThan(shieldAll.getPatterns().length);

    console.log(`All patterns: ${shieldAll.getPatterns().length}, time: ${timeAll.toFixed(2)}ms`);
    console.log(`Filtered patterns: ${shieldFiltered.getPatterns().length}, time: ${timeFiltered.toFixed(2)}ms`);
    console.log(`Performance improvement: ${((timeAll - timeFiltered) / timeAll * 100).toFixed(1)}%`);
  });

  it('should handle unknown categories gracefully', async () => {
    const shield = new OpenRedaction({
      categories: ['personal', 'unknown-category', 'financial']
    });
    const patterns = shield.getPatterns();

    // Should still load known categories
    expect(patterns.length).toBeGreaterThan(0);
});

  it('should prioritize categories over includeNames/includeEmails', async () => {
    // Categories should take priority over include* options
    const shield = new OpenRedaction({
      categories: ['financial'], // Only financial
      includeNames: false, // This should be ignored when categories are set
      includeEmails: false // This should be ignored when categories are set
    });
    const patterns = shield.getPatterns();
    const patternTypes = patterns.map(p => p.type);

    // Should only have financial patterns
    expect(patternTypes.some(t => t.includes('CREDIT_CARD') || t.includes('IBAN'))).toBe(true);
  });

  it('should work with custom patterns alongside categories', async () => {
    const shield = new OpenRedaction({
      categories: ['personal'],
      customPatterns: [{
        type: 'CUSTOM_ID',
        regex: /CUST-\d{6}/g,
        priority: 90,
        placeholder: '[CUSTOM_ID_{n}]',
        description: 'Custom ID format'
      }]
});

    const patterns = shield.getPatterns();
    const patternTypes = patterns.map(p => p.type);

    // Should have both built-in (from category) and custom pattern types
    expect(patternTypes.some(t => t === 'EMAIL')).toBe(true);
    expect(patternTypes.some(t => t === 'CUSTOM_ID')).toBe(true);
  }
}
